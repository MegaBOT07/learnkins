# Token System Audit & Production-Grade Redesign

## Part 1: All Known Bugs & Issues

### CRITICAL - Security

| # | Issue | File | Severity |
|---|-------|------|----------|
| C1 | `POST /api/tokens/award` has NO `authorize('admin')` middleware. Any authenticated user can self-award unlimited tokens | `backend/src/routes/tokens.js:9` | **Critical** |
| C2 | `persist()` function undefined in `claimDailyReward()` - throws ReferenceError, catch calls unprotected `/tokens/award`, awarding tokens even after daily claim rejected | `project/src/context/TokenContext.tsx:233` | **Critical** |
| C3 | Init auto-awards +5 on EVERY page load via `award()` -> `/tokens/award` (not daily endpoint), bypassing daily check. +5 per refresh | `TokenContext.tsx:61-64` | **Critical** |
| C4 | `adminAPI.awardUserTokens()` calls wrong endpoint - awards admin instead of target user | `project/src/utils/api.js:226` | **High** |
| C5 | Hardcoded JWT secret fallback - anyone with source can forge auth tokens | `backend/src/server.js:51` | **Critical** |
| C6 | LIVE secrets in `.env` committed - Razorpay keys, DB creds, email password, OpenRouter key. NOT in .gitignore | `backend/.env` | **Critical** |
| C7 | No Razorpay webhook - payment relies solely on client-side HMAC, no server-side capture confirmation | - | **High** |
| C8 | OpenRouter API key exposed in browser bundle via VITE_ prefix | `project/.env` | **High** |

### CRITICAL - Race Conditions / Data Integrity

| # | Issue | File | Severity |
|---|-------|------|----------|
| R1 | Tokens deducted BEFORE purchase record created - if later DB fails, user loses tokens with no item | `shopController.js:80-82` | **Critical** |
| R2 | Read-modify-write pattern on balance - two concurrent requests can both pass check, balance goes negative | `tokenController.js:67-68`, `shopController.js:80-82` | **High** |
| R3 | `verifyPayment` no idempotency check - calling multiple times with same order_id re-awards tokens | `paymentController.js:85-145` | **High** |
| R4 | `TokenContext.award()` has NO rollback on failure (unlike `redeem()` which rolls back). Balance drifts up | `TokenContext.tsx:148-150` | **Medium** |
| R5 | Init syncs from server AFTER local award() - server already processed award, every refresh adds tokens | `TokenContext.tsx:62-92` | **High** |

### MODERATE

| # | Issue | File | Severity |
|---|-------|------|----------|
| M1 | `award-user/:id` checks admin in controller body instead of middleware | `tokens.js:11` | Low |
| M2 | UTC vs local time mismatch for daily reward | `tokenController.js:110-111` vs `TokenContext.tsx:34-38` | Medium |
| M3 | No per-endpoint rate limiting on token routes | - | Medium |
| M4 | `USE_INMEMORY_DB=true` in .env - ephemeral if deployed | `backend/.env` | High |
| M5 | Shop items hard-deleted - breaks purchase history refs | `shopController.js:157` | Medium |
| M6 | `ShopItem.create(req.body)` passes all fields blindly | `shopController.js:135` | Low |

---

## Part 2: Production-Grade Token System Redesign

### Design Principles (Stripe / Duolingo / Discord / Khan Academy inspired)

1. **Atomic operations** - No read-modify-write. Use `findOneAndUpdate` with conditional `$gte` filters.
2. **Idempotency** - Every token operation has a unique key. Replay = no double processing.
3. **Ledger as source of truth** - Balance is cached read model. Ledger is immutable append-only audit trail.
4. **Separation of concerns** - `TokenAccount` separate from `User` doc to avoid lock contention.
5. **Economy controls** - Daily earn caps, per-action limits, configurable.
6. **RBAC via middleware** - All authorization in route middleware, not controller bodies.
7. **Webhook verification** - Server-side payment confirmation via Razorpay webhooks.
8. **Sharding-friendly** - All user operations hash to same shard.
9. **Caching** - Redis for hot reads, invalidation on writes.
10. **Audit trail** - Every token movement permanently recorded.

---

### Data Models

#### TokenAccount (separate collection)

```js
{
  userId:           { type: ObjectId, ref: 'User', unique: true, required: true },
  balance:          { type: Number, default: 0, min: 0 },
  lifetimeEarned:   { type: Number, default: 0 },
  lifetimeSpent:    { type: Number, default: 0 },

  // Daily tracking
  dailyEarnedDate:  { type: String },        // YYYY-MM-DD
  dailyEarnedToday: { type: Number, default: 0 },

  // Streak
  lastDailyClaim:   { type: Date },
  currentStreak:    { type: Number, default: 0 },
  longestStreak:    { type: Number, default: 0 },

  // Optimistic lock
  version:          { type: Number, default: 0 },

  // Admin controls
  isFrozen:         { type: Boolean, default: false },
  freezeReason:     { type: String },

  timestamps: true
}
// Indexes: { userId: 1 } unique, { dailyEarnedDate: 1, dailyEarnedToday: 1 }
```

#### TokenLedgerEntry (immutable, append-only)

```js
{
  userId:          { type: ObjectId, ref: 'User', required: true },
  type:            { type: String, enum: ['earn','spend','refund','expire','admin_adjust'], required: true },
  amount:          { type: Number, required: true },   // always positive; sign from type
  balanceBefore:   { type: Number, required: true },
  balanceAfter:    { type: Number, required: true },

  referenceType:   { type: String, enum: ['quiz','game','daily','payment','shop','admin','refund','achievement'] },
  referenceId:     { type: ObjectId },

  idempotencyKey:  { type: String, unique: true, required: true },
  reason:          { type: String, required: true },
  description:     { type: String },
  meta:            { type: Mixed },

  timestamps: true
}
// Indexes: { userId: 1, createdAt: -1 }, { idempotencyKey: 1 } unique global
```

#### EconomyConfig (singleton, admin-managed)

```js
{
  dailyEarnCap:       { type: Number, default: 100 },
  dailyRewardAmount:  { type: Number, default: 5 },
  quizMaxTokens:      { type: Number, default: 25 },
  quizDailyCount:     { type: Number, default: 3 },
  gameMaxTokens:      { type: Number, default: 25 },
  gameDailyCount:     { type: Number, default: 5 },
  streakBonusEnabled: { type: Boolean, default: true },
  streakMultiplier:   { type: Number, default: 1.0 },
  updatedBy:          { type: ObjectId, ref: 'User' },
  timestamps: true
}
```

---

### Core Algorithms

#### SPEND Tokens - Fully atomic, no race condition possible

```
function spend(userId, amount, refType, refId, reason):
  idempotencyKey = `${refType}:${refId}`
  if (LedgerEntry.findOne({ idempotencyKey })) return existing

  result = TokenAccount.findOneAndUpdate(
    { userId, balance: { $gte: amount } },    // ATOMIC check + decrement
    { $inc: { balance: -amount, lifetimeSpent: +amount } },
    { new: true }
  )
  if (!result) throw INSUFFICIENT_TOKENS

  LedgerEntry.create({
    userId, type: 'spend', amount,
    balanceBefore: result.balance + amount,
    balanceAfter: result.balance,
    referenceType: refType, referenceId: refId,
    idempotencyKey, reason
  })
  return result.balance
```

**Why race-condition-free:** `findOneAndUpdate` with `{ balance: { $gte: amount } }` is a single atomic MongoDB op. WiredTiger does document-level locking. Two concurrent calls: one wins, one gets null. Zero chance of negative balance.

#### EARN Tokens - Atomic with daily cap

```
function earn(userId, amount, refType, refId, reason):
  idempotencyKey = `${refType}:${refId}`
  if (LedgerEntry.findOne({ idempotencyKey })) return existing

  today = dateStr()
  result = TokenAccount.findOneAndUpdate(
    {
      userId,
      $expr: {
        $lt: [
          { $cond: [{ $eq: ['$dailyEarnedDate', today] }, '$dailyEarnedToday', 0] },
          DAILY_CAP - amount + 1
        ]
      }
    },
    [{ $set: {
        balance: { $add: ['$balance', amount] },
        lifetimeEarned: { $add: ['$lifetimeEarned', amount] },
        dailyEarnedDate: today,
        dailyEarnedToday: {
          $cond: [
            { $eq: ['$dailyEarnedDate', today] },
            { $add: ['$dailyEarnedToday', amount] },
            amount
          ]
        }
    }}],
    { new: true }
  )
  if (!result) throw DAILY_CAP_REACHED

  LedgerEntry.create({...})
```

#### DAILY REWARD - Atomic claim

```
function claimDaily(userId):
  idempotencyKey = `daily:${userId}:${todayStr()}`
  if (LedgerEntry.findOne({ idempotencyKey })) return existing

  result = TokenAccount.findOneAndUpdate(
    { userId, $or: [
      { lastDailyClaim: null },
      { lastDailyClaim: { $lt: todayStart } }
    ]},
    { $inc: { balance: DAILY_AMOUNT, lifetimeEarned: DAILY_AMOUNT },
      $set: { lastDailyClaim: new Date() } },
    { new: true }
  )
  if (!result) throw ALREADY_CLAIMED

  // Streak logic (non-critical path, can be separate)
  if (lastClaim was yesterday) { currentStreak += 1 }
  else { currentStreak = 1 }
  longestStreak = max(currentStreak, longestStreak)

  // Streak bonus (e.g., +2 extra for 7-day streak)
  if (currentStreak >= 7) {
    bonus = Math.floor(DAILY_AMOUNT * 0.4)
    balance += bonus
    LedgerEntry.create({...streak bonus...})
  }

  LedgerEntry.create({...daily reward entry...})
  return { balance, streak, bonus }
```

#### SHOP PURCHASE - Atomic with rollback

```
function purchase(userId, itemId):
  validate item exists, active, in stock, not already owned
  idempotencyKey = `shop:${userId}:${itemId}`

  result = TokenAccount.findOneAndUpdate(
    { userId, balance: { $gte: item.price } },
    { $inc: { balance: -item.price, lifetimeSpent: +item.price } },
    { new: true }
  )
  if (!result) throw INSUFFICIENT_TOKENS

  try:
    purchase = UserPurchase.create({userId, itemId, tokensSpent: item.price})
    LedgerEntry.create({...spend entry...})
    if (item.stock !== -1) item.stock -= 1
  catch (error):
    // ROLLBACK - refund atomically
    TokenAccount.findOneAndUpdate(
      { userId },
      { $inc: { balance: +item.price, lifetimeSpent: -item.price } }
    )
    throw PURCHASE_FAILED

  return { purchase, balance: result.balance - item.price }
```

#### PAYMENT VERIFICATION - Idempotent

```
function verifyPayment(razorpay_order_id, razorpay_payment_id, sig):
  verify HMAC signature

  payment = Payment.findOne({ razorpayOrderId: razorpay_order_id })
  if (payment.status === 'paid') return { alreadyProcessed: true }  // IDEMPOTENT

  // Optional: verify capture with Razorpay API
  rpPayment = razorpay.payments.fetch(razorpay_payment_id)
  if (rpPayment.status !== 'captured') throw NOT_CAPTURED

  payment.status = 'paid'
  payment.razorpayPaymentId = razorpay_payment_id
  payment.razorpaySignature = sig
  await payment.save()

  earn(userId, payment.tokenAmount, 'payment', payment._id, 'Token purchase')
```

**Webhook endpoint:**
```
POST /api/payments/webhook (NO auth middleware - verified by webhook secret)
  verify HMAC with RAZORPAY_WEBHOOK_SECRET
  if event === 'payment.captured':
    process same as verifyPayment, idempotent via payment order_id
  return 200
```

---

### Route Architecture (proper RBAC)

```js
// tokens.js
router.get('/balance',             protect, getBalance);
router.get('/transactions',        protect, getTransactions);
router.get('/daily/status',        protect, getDailyStatus);
router.post('/daily',              protect, claimDailyReward);
router.post('/redeem',             protect, redeemTokens);
router.post('/award',              protect, authorize('admin'), awardTokens);       // FIXED
router.post('/award-user/:id',    protect, authorize('admin'), awardUserTokens);    // FIXED
router.get('/user/:id',            protect, authorize('admin'), getUserTransactions);
router.get('/admin/stats',         protect, authorize('admin'), getAdminTokenStats);
router.get('/admin/config',        protect, authorize('admin'), getEconomyConfig);
router.put('/admin/config',        protect, authorize('admin'), updateEconomyConfig);

// payments.js
router.get('/plans',               getPlans);                     // public
router.use(protect);
router.post('/create-order',       createOrder);
router.post('/verify',             verifyPayment);
router.get('/history',             getPaymentHistory);
// webhook route - NOT behind protect, verified by secret
```

---

### Caching Strategy (Redis)

| Key | Value | TTL | Invalidation |
|-----|-------|-----|-------------|
| `token:balance:{userId}` | `{ balance, lifetimeEarned, lifetimeSpent }` | 30s | On any earn/spend for user |
| `token:daily:{userId}` | `{ canClaim, streak }` | until midnight | On daily claim |
| `token:leaderboard` | sorted set of userId -> balance | 60s | ZINCRBY on earn events |
| `economy:config` | full config | 300s | On config update |

Leaderboard at scale: Redis Sorted Set with `ZINCRBY token:leaderboard <amount> <userId>` on earn, `ZREVRANGE 0 9 WITHSCORES` for top 10.

---

### Rate Limiting

```
Token earn endpoints:    30 req/min per user (separate rate limiter)
Token redeem endpoints:  20 req/min per user
Daily claim:             5 req/min per user
Admin endpoints:         60 req/min per admin
Global (existing):       100 req/15min per IP (unchanged)
```

### Economy Controls Summary

| Control | Default | Purpose |
|---------|---------|---------|
| Daily earn cap | 100 tokens | Prevent inflation |
| Quiz max earn | 25 tokens | Per-quiz limit |
| Quiz daily count | 3 | Max earning quizzes/day |
| Game max earn | 25 tokens | Per-game limit |
| Game daily count | 5 | Max earning games/day |
| Daily reward | 5 tokens | Once per day |
| 7-day streak bonus | +2 tokens | Encourages daily login |
| Purchase min | 1 token | Minimum item price |

---

### Client-Side Fixes (TokenContext.tsx)

```
1. REMOVE init auto-award on page load (lines 60-66) - only sync from server
2. DEFINE persist() function:
     const persist = (balance, tx, lastRewardDay) => {
       localStorage.setItem(TOKEN_KEY, JSON.stringify({ balance, transactions: tx, lastRewardDay }));
     };
3. claimDailyReward should call persist() correctly instead of undefined function
4. REMOVE fallback award() call in claimDailyReward catch - trust server response
5. Add rollback to award() on server failure (same pattern as redeem())
6. Fix daily eligibility to use UTC dates consistent with server
```

---

### Scaling to Extreme User Counts

| Scale | Strategy |
|-------|----------|
| 1K-10K users | Current MongoDB setup + atomic fixes + Redis cache |
| 10K-100K users | Shard TokenAccount + TokenLedger by userId (hashed) |
| 100K-1M users | Add read replicas, leaderboard via Redis, archive old ledger entries (>90 days) |
| 1M+ users | Event sourcing: write ledger to Kafka, materialize balance via stream processor, cache in Redis |

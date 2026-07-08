# Quiz Points System — Issues to Review

## Professional Quiz Issues

### Issue 1: Double XP (FIXED)
**Status:** ✅ Fixed — client-side `addExperience` removed

**File:** `project/src/pages/assessment/ProfessionalQuiz.tsx`

**Problem:**
XP was awarded **twice** — once server-side in `professionalQuizController.js:485` and once client-side in `ProfessionalQuiz.tsx:155`.

| Source | Code | Example (passed, 5/5 correct) |
|--------|------|-------------------------------|
| Server | `user.addExperience(totalXP)` where `totalXP = (passed ? 50 : 0) + correctCount * 5` | `50 + 25 = 75 XP` |
| Client (removed) | `addExperience(Math.floor(pct / 2))` | `~50 XP` |
| **Total before fix** | | **~125 XP** instead of 75 |

**Fix:** Removed `addExperience(Math.floor(pct / 2))` from `ProfessionalQuiz.tsx`. XP is now awarded only server-side.

---

### Issue 2: Token award is client-side only (UNFIXED)
**Severity:** Medium

**File:** `project/src/pages/assessment/ProfessionalQuiz.tsx:136-148`

**Problem:**
Tokens are awarded by calling `award(tokensAwarded, ...)` which runs in the browser. If the user closes the tab or loses network before the async call completes, tokens are **lost forever**.

**Formula:** `Math.floor(percentage / 10)` — 1 token per 10% score.

**Contrast with regular quizzes:** Regular quizzes award tokens **server-side** inside `awardQuizTokens()` which is atomic with the submission — tokens are always awarded, no risk of loss.

**Suggested fix:**
Move token award logic into `professionalQuizController.submitProfessionalQuiz()` and create a `TokenTransaction` record there, just like `awardQuizTokens()` does for regular quizzes.

---

### Issue 3: No TokenTransaction audit trail (UNFIXED)
**Severity:** Medium

**File:** `backend/src/controllers/professionalQuizController.js`

**Problem:**
Professional quiz token awards create **no** `TokenTransaction` record in the database. The `TokenTransaction` model tracks all token movements with `userId`, `amount`, `reason`, and `meta` fields, but professional quiz awards bypass it entirely.

**Contrast with regular quizzes:**
Regular quizzes call `TokenTransaction.create({ userId, type: 'award', amount: tokens, reason: 'Quiz completed (X%)', meta: { percentage } })` — every award is traceable.

**Suggested fix:**
Add `TokenTransaction.create(...)` call inside `submitProfessionalQuiz()` when awarding tokens.

---

### Issue 4: Low points per correct answer (UNFIXED)
**Severity:** Low

**File:** `project/src/pages/assessment/ProfessionalQuiz.tsx:154`

**Problem:**
`addPoints(earnedScore)` uses the raw earned score (e.g., 3 points for 3/6 correct).

**Contrast with regular quizzes:**
Regular quiz does `addPoints(correctCount * 10)` — 30 points for 3 correct.

**Discrepancy:** Professional quiz gives ~10x fewer `totalPoints` per correct answer than a regular quiz.

**Suggested fix:**
Change to `addPoints(earnedScore * 10)` or `addPoints(correctCount * 10)`.

---

### Issue 5: Stats section has hardcoded values (UNFIXED)
**Severity:** Low

**File:** `project/src/pages/assessment/ProfessionalQuizzes.tsx:153-157`

**Problem:**
The statistics cards at the top of the quizzes page mix dynamic and hardcoded values:

| Stat | Value | Source |
|------|-------|--------|
| Total Quizzes | `quizzes.length` | ✅ Dynamic |
| Certifications | `"12+"` | ❌ Hardcoded |
| Active Users | `"5,000+"` | ❌ Hardcoded |
| Avg. Pass Rate | `${avgPassRate}%` | ✅ Dynamic |

**Suggested fix:**
Fetch real certification count and active user stats from the backend API (e.g., `GET /api/stats/dashboard` or a dedicated endpoint for professional quiz stats).

---

## Cross-System Conflicts (Professional vs Regular)

### C1: Points formula mismatch
| | Professional | Regular |
|---|---|---|
| **Code** | `addPoints(earnedScore)` | `addPoints(correctCount * 10)` |
| **Example** | 3 correct → 3 points | 3 correct → 30 points |
| **Ratio** | 1x | 10x |

### C2: Token formula mismatch
| | Professional | Regular |
|---|---|---|
| **Formula** | `Math.floor(pct / 10)` — 1 per 10% | Scale: 100%=25, ≥80%=15, ≥60%=10, <60%=5 |
| **80% score** | 8 tokens | 15 tokens |
| **100% score** | 10 tokens | 25 tokens |
| **Award location** | Client-side only | Server-side (`awardQuizTokens`) |

### C3: XP formula mismatch
| | Professional | Regular |
|---|---|---|
| **Server formula** | `(passed ? 50 : 0) + correctCount * 5` | `Math.round(percentage * 0.5)` |
| **Example (80%)** | passed=50 + 4*5 = 70 XP | 80 * 0.5 = 40 XP |
| **Award location** | Server only (after fix) | Server + Client (double) |

### C4: TokenTransaction logging mismatch
| | Professional | Regular |
|---|---|---|
| **TokenTransaction** | Never created | Created via `awardQuizTokens()` |
| **Audit trail** | None | Full trace with reason, percentage, timestamp |

### C5: Response field names mismatch
| | Professional | Regular |
|---|---|---|
| **Score fields** | `{ score, totalScore, percentage, passed, timeTaken }` | `{ correctCount, total, percentage, passed, tokensEarned, certificateEligible }` |
| **Points returned** | Raw earned points (e.g., 3) | Token count + correct count |
| **Field for correct answers** | Not returned separately | `correctCount` |

### C6: Question ID format mismatch
| | Professional | Regular |
|---|---|---|
| **ID format** | `id: string` — `Date.now()-index` | (likely ObjectId or different) |
| **Points per question** | Dynamic via `question.points` | Default 1 per question |

### C7: Terminology/naming inconsistency
| Term | Professional meaning | Regular meaning |
|---|---|---|
| **`score`** | Raw earned points | Not used (uses `correctCount`) |
| **`points`** | Per-question weight & GameContext counter | Achievement-based `user.points` (server) |
| **`tokens`** | In-app currency (client award) | In-app currency (server award + audit) |
| **`experience`/`XP`** | Drives level (server calc) | Drives level (server calc) |
| **`totalPoints`** | GameContext local-only counter | GameContext local-only counter |
| **`user.points` (server)** | Only updated via achievements | Only updated via achievements |

---

## Regular Quiz Issues (For Future Fix)

These issues exist in the regular quiz flow but are **not being addressed right now**.

### Issue R1: Double XP (Client + Server)
**Files:**
- `backend/src/controllers/quizController.js:487` — `user.experience += Math.round(percentage * 0.5)`
- `project/src/pages/assessment/Quiz.tsx:151` — `addExperience(correctCount * 5)`

**Problem:**
Same as professional quiz Issue 1 — XP is awarded both server-side and client-side, resulting in inflated XP gains.

---

### Issue R2: Backend vs Frontend Level Curve Mismatch
**Files:**
- `backend/src/models/User.js:208-211` — `Math.floor(experience / 100) + 1` (linear)
- `project/src/context/GameContext.tsx` — exponential curve `100 * 1.5^(level-1)` (exponential)

**Problem:**
Server level and client level will diverge over time because they use different formulas.
- Server: every 100 XP = 1 level (linear)
- Client: requires more XP per level as level increases (exponential)

After collecting enough XP, the frontend will show a different level than what's stored in the database.

---

### Issue R3: GameContext.totalPoints Not Synced to Server
**Files:**
- `project/src/context/GameContext.tsx:230-236` — `addPoints()` only updates local state
- `backend/src/controllers/quizController.js` — server updates `user.points` only through achievements

**Problem:**
`totalPoints` in `GameContext` is never sent to the server. If the user clears localStorage or switches devices, their points reset to 0. Only the `achievements` system adds to `user.points` on the backend.

---

### Issue R4: TokenTransaction Records Created But Not Returned to Client
**File:** `backend/src/controllers/quizController.js:501-505`

**Problem:**
`awardQuizTokens()` creates a `TokenTransaction` but the client never reads or displays it on the quiz results screen. The user sees no confirmation of tokens earned after a regular quiz unless they go to the wallet page.

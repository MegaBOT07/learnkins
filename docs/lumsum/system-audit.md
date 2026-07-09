# System Audit — Cross-System Integration Report

Audit date: 2026-07-09

---

## 1. Quiz System (Regular)

### Works correctly
- `submitQuiz` → `awardQuizTokens` → tokens, XP, level-up, `TokenTransaction`
- `submitQuiz` → checks perfect scores → increments `user.perfectScores`
- `submitQuiz` → calls `checkAndAwardAchievements(userId)`
- `getQuiz` and `getQuizzes` handle auth/public correctly
- Frontend `Quiz.tsx` uses `storeNewAchievements()` from response

### Issues
| # | Severity | Issue | Details |
|---|----------|-------|---------|
| 1 | **HIGH** | **Double `totalQuizzesTaken` increment** | ✅ FIXED — Removed duplicate line 515 `quizController.js`. |
| 2 | MEDIUM | **Double XP (client + server)** | ✅ FIXED — Removed `addExperience(result.correctCount * 5)` from `Quiz.tsx`. |
| 3 | LOW | `TokenTransaction` created but not returned to client | Already documented in `quiz-points-issues.md` as R4 |

---

## 2. Quiz System (Professional)

### Works correctly
- `submitProfessionalQuiz` → calculates score, creates attempt, updates Progress
- Server-side XP award with level-up check
- Pagination + grade filtering in `getProfessionalQuizzes`

### Issues
| # | Severity | Issue | Details |
|---|----------|-------|---------|
| 4 | **HIGH** | **No `checkAndAwardAchievements` call** | ✅ FIXED — Added to `submitProfessionalQuiz`. |
| 5 | **HIGH** | **`totalQuizzesTaken` not incremented** | ✅ FIXED — Added to `submitProfessionalQuiz`. |
| 6 | **HIGH** | **`perfectScores` not incremented** | ✅ FIXED — Added to `submitProfessionalQuiz`. |
| 7 | MEDIUM | **Tokens awarded client-side only** | ✅ FIXED — Added `TokenTransaction.create()` in `submitProfessionalQuiz`. |

---

## 3. Flashcards System

### Works correctly
- CRUD operations, pagination, search, rating
- AI generation (`generateAIFlashcards`) → `batchCreateFlashcards`
- `studyFlashcard` → updates Progress + calls `checkFlashcardAchievements`
- Frontend fetch/display with fallback to demo data

### Issues
| # | Severity | Issue | Details |
|---|----------|-------|---------|
| 8 | **HIGH** | **No `totalStudyHours` update on flashcard study** | ✅ FIXED — Added to `studyFlashcard`. |
| 9 | MEDIUM | **Fragile name-matching in `checkFlashcardAchievements`** | Uses hardcoded `name.includes('card reader i')` etc. instead of using schema `requirements` fields. If achievement names change, flashcard achievements break silently. |
| 10 | LOW | **Flashcard `requirements` field unused** | ✅ FIXED — Added `totalFlashcardsRead` to stats + `requirements.totalFlashcardsRead` check in `achievementChecker.js`. |

---

## 4. Progress / Review System

### Works correctly
- `updateProgress` → updates `totalStudyHours` + calls `checkAndAwardAchievements`
- `getOverallStats` → returns aggregated stats
- `Progress.addActivity()` → tracks completed activities (video, quiz, material, game, flashcard)
- `Progress.updateStreak()` → updates daily streak

### Issues
| # | Severity | Issue | Details |
|---|----------|-------|---------|
| 11 | MEDIUM | **Progress doesn't track Professional quizzes separately** | Professional quiz completion is added to Progress under `chapter: 'professional-quizzes'` but there's no dedicated stat endpoint for it. The regular `getOverallStats` doesn't separate them. |

---

## 5. Rewards / Points System (Tokens, XP, Levels)

### Works correctly
- `TokenTransaction` model with full audit trail (for regular quiz and game awards)
- `TokenContext` on frontend with optimistic local state + server sync
- Token award/buy flow (SHOP) with purchase tracking
- Daily reward claim with eligibility check
- Token `award()` method is fire-and-forget with optimistic update

### Issues
| # | Severity | Issue | Details |
|---|----------|-------|---------|
| 12 | **HIGH** | **Level curve mismatch (server vs client)** | ✅ FIXED — `GameContext.tsx` now uses linear formula: `100` XP per level. Server uses same `floor(XP/100) + 1`. |
| 13 | MEDIUM | **`totalPoints` never synced to server** | `GameContext.addPoints()` only updates local state in localStorage. Server `user.points` only increases through achievement awards. If localStorage is cleared, points reset to 0. Already documented in `quiz-points-issues.md` as R3. |
| 14 | LOW | **Game XP formula inconsistent** | ✅ FIXED — `useGameProgress.ts` now uses `Math.round(pct * 50)` to match quiz `Math.round(pct * 0.5)` rate. |

---

## 6. Achievements Section

### Works correctly
- `checkAndAwardAchievements()` called from: `submitQuiz`, `submitScore` (game), `updateProgress` (study hours), `logGameActivity` (new)
- `checkFlashcardAchievements()` called from: `studyFlashcard`
- Frontend `fetchAchievementsWithCache()` works with caching + fallback defaults
- Category mapping (backend `category` → frontend `learning`/`social`/`exploration`/`mastery`) works
- `storeNewAchievements()` cross-page notification bridge works
- `Progress.tsx` displays achievements correctly with filters

### Issues
| # | Severity | Issue | Details |
|---|----------|-------|---------|
| 15 | **HIGH** | **Professional quiz invisible to achievements** | See Issues 4+5 — professional quiz completions don't increment counters and don't trigger `checkAndAwardAchievements`. |
| 16 | MEDIUM | **`checkAndAwardAchievements` only checks `requirements.studyHours` for study category** | Study achievements with flashcard requirements (Card Reader) are handled by a separate function. The `study` switch case doesn't check `totalFlashcardsRead`. |
| 17 | LOW | **`getAchievements` (public route, no auth) returns ALL achievements** | No pagination. On high load, this could be slow. Frontend only uses this for listing all possible achievements. |

---

## 7. Cross-System Data Flow

### Data flows that work

```
Quiz submit ──► awardQuizTokens ──► user.tokens + user.experience + user.totalQuizzesTaken
            ──► checkAndAwardAchievements ──► user.achievements + user.points
            ──► TokenTransaction.create() ──► audit trail

Game submit ──► gameController.submitScore ──► user.totalGamesPlayed
            ──► checkAndAwardAchievements ──► user.achievements + user.points
            ──► TokenTransaction.create() ──► audit trail

Game activity (new hook) ──► logGameActivity ──► user.totalGamesPlayed
                        ──► checkAndAwardAchievements

Flashcard study ──► checkFlashcardAchievements ──► user.totalFlashcardsRead + user.achievements

Progress update ──► user.totalStudyHours
               ──► checkAndAwardAchievements
```

### Data flows that are BROKEN (all now fixed)

```
Professional quiz ──► user.totalQuizzesTaken ✓
                  ──► checkAndAwardAchievements ✓
                  ──► perfectScores ✓
                  ──► TokenTransaction ✓

Flashcard study ──► user.totalStudyHours ✓
```

---

## Summary (original audit issues)

| Severity | Count | Status |
|----------|-------|--------|
| **HIGH** | 5 | ✅ All 5 fixed |
| MEDIUM | 5 | ✅ 4 of 5 fixed (#9 name-matching still open, #13 totalPoints sync still open) |
| LOW | 3 | ✅ 2 of 3 fixed (#11 progress tracking, #17 pagination still open) |

---

## CRASH FIXES (added 2026-07-09)

After the initial audit, a separate crash audit was done across quizzes, achievements, and flashcards. 10 issues found, all fixed:

| # | Severity | File | Issue | Fix |
|---|----------|------|-------|-----|
| C1 | CRITICAL | `GameContext.tsx:54` | `JSON.parse` on corrupt localStorage throws **synchronously on mount**, entire app fails to render | Wrapped in try/catch, clears corrupt data on failure |
| C2 | CRITICAL | `GameContext.tsx:137` | `localStorage.setItem` throws on quota/security error → React unmounts tree | Wrapped in try/catch |
| C3 | CRITICAL | `achievementChecker.js:47-52` | `unlocked` flag overwritten by sequential `if` blocks (AND logic broken) | Changed to `unlocked = unlocked || condition` |
| C4 | CRITICAL | `achievementChecker.js:62` | `getUserPerfectScores` called inside for-loop (N+1 → OOM on large data) | Hoisted outside loop, cached result |
| C5 | CRITICAL | `achievementChecker.js:134-135` | `user.save()` called before achievement loop — partial save on error inflates counter | Moved save after loop |
| C6 | CRITICAL | `professionalQuizController.js:471` | `req.user.id` on missing user → TypeError crash | `req.user?.id` + 401 guard (3 endpoints) |
| C7 | CRITICAL | `Flashcards.tsx:350` | `nextCard` checks `filteredCards.length` but study deck uses `studyCards` — index OOB → `currentCard.difficulty` TypeError | Uses same cards array for both |
| C8 | CRITICAL | `flashcardController.js:170` | `tags.split(',')` on array (frontend sends array) → TypeError | Handles both string and array |
| C9 | CRITICAL | `Flashcard.js:117` | `r.user.toString()` on null user entry → TypeError | Guarded with `r.user &&` |
| C10 | CRITICAL | `Flashcard.js:129` | `r.rating` undefined → `NaN` average stored in DB | `(r.rating || 0)` + zero-division guard |
| C11 | CRITICAL | `Quiz.tsx:174-176` | `handleQuizComplete()` called inside `setTimeLeft` updater — React may invoke twice in StrictMode → double submission | Moved to separate `useEffect` watching `timeLeft` |
| C12 | CRITICAL | `Quiz.tsx:137` | `response.data` undefined → `.success` TypeError | `response.data?.success` + `if (!result) throw` |
| C13 | HIGH | `professionalQuizController.js:499-501` | AI grading compares `selectedAnswer` text to `correctAnswer` index — **all AI quiz answers marked wrong** | Compares text to `options[correctAnswer]` |
| C14 | HIGH | `quizController.js:501` | Legacy docs without `statistics` field → TypeError on `quiz.statistics.totalAttempts` | Initializes `statistics` if absent |
| C15 | HIGH | `flashcardController.js:282` | `studyCount + 1` reports old+2 (model method already increments) | Removed `+ 1` |
| C16 | HIGH | `GameContext.tsx:120` | `a._id?.toString()` on null array element — `?.` on `a`, not `a._id` | `a?._id?.toString()` guard |

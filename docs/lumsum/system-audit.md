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
| 1 | **HIGH** | **Double `totalQuizzesTaken` increment** | `awardQuizTokens` (line 21) increments `user.totalQuizzesTaken`. Then `submitQuiz` (line 515) increments it AGAIN. Every quiz adds +2 to the count instead of +1. |
| 2 | MEDIUM | **Double XP (client + server)** | Server awards `Math.round(percentage * 0.5)` XP in `awardQuizTokens`. Client also calls `addExperience(correctCount * 5)` in `Quiz.tsx:155`. XP is effectively doubled. |
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
| 4 | **HIGH** | **No `checkAndAwardAchievements` call** | `submitProfessionalQuiz` (line 519-528) awards XP but NEVER calls `checkAndAwardAchievements()`. Professional quiz completions cannot trigger any achievement unlocks (Quiz Taker, Perfect Score, etc.). |
| 5 | **HIGH** | **`totalQuizzesTaken` not incremented** | Professional quiz submissions never increment `user.totalQuizzesTaken`. So they're completely invisible to the achievement counting system. |
| 6 | **HIGH** | **`perfectScores` not incremented** | Perfect score on a professional quiz never increments `user.perfectScores`. Perfect Score achievements can never be earned through professional quizzes. |
| 7 | MEDIUM | **Tokens awarded client-side only** | `ProfessionalQuiz.tsx:157-170` awards tokens via `award()` (TokenContext) which fires an optimistic local update + async server call. No `TokenTransaction` record for professional quiz token awards. Already documented in `quiz-points-issues.md` as Issue 2. |

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
| 8 | **HIGH** | **No `totalStudyHours` update on flashcard study** | `studyFlashcard` updates Progress but never updates `user.totalStudyHours`. Flashcard study contributes nothing to Dedicated Learner / Scholar achievements. |
| 9 | MEDIUM | **Fragile name-matching in `checkFlashcardAchievements`** | Uses hardcoded `name.includes('card reader i')` etc. instead of using schema `requirements` fields. If achievement names change, flashcard achievements break silently. |
| 10 | LOW | **Flashcard `requirements` field unused** | Card Reader seeds set all `requirements` to 0. The `flashcardsRead` requirement doesn't exist as a schema field on Achievement. The field `totalFlashcardsRead` exists on User but isn't checked in `checkAndAwardAchievements` (separate function handles it). |

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
| 12 | **HIGH** | **Level curve mismatch (server vs client)** | Server: `Math.floor(experience / 100) + 1` (linear, every 100 XP = 1 level). Client: `100 * 1.5^(level-1)` (exponential). After collecting enough XP, frontend level will show differently than database. Already documented in `quiz-points-issues.md` as R2. |
| 13 | MEDIUM | **`totalPoints` never synced to server** | `GameContext.addPoints()` only updates local state in localStorage. Server `user.points` only increases through achievement awards. If localStorage is cleared, points reset to 0. Already documented in `quiz-points-issues.md` as R3. |
| 14 | LOW | **Game XP formula inconsistent** | `useGameProgress.completeGame()` awards `Math.round(pct * 100)` XP. Compare: regular quiz awards `Math.round(percentage * 0.5)` XP. A 100% game score gives 100 XP; a 100% quiz score gives 50 XP. Games are 2x more rewarding. |

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

### Data flows that are BROKEN

```
Professional quiz ──► (nothing) ──► X user.totalQuizzesTaken
                  ──► (nothing) ──► X checkAndAwardAchievements
                  ──► (nothing) ──► X perfectScores

Flashcard study ──► (nothing) ──► X user.totalStudyHours
```

---

## Summary

| Severity | Count | Key Fix Needed |
|----------|-------|----------------|
| **HIGH** | 5 | Fix double `totalQuizzesTaken` (#1). Wire professional quizzes to achievements (#4, #5, #6). Add `totalStudyHours` update on flashcard study (#8). Fix level curve mismatch (#12). |
| MEDIUM | 5 | Remove client-side XP doubling (#2). Refactor flashcard achievement name-matching (#9). Professional quiz token audit trail (#7). `totalPoints` sync to server (#13). |
| LOW | 3 | Game XP formula (#14). Professional quiz Progress tracking (#11). Public achievements pagination (#17). |

### Blocking (must fix for correctness)
1. **`quizController.js`** — Remove the duplicate `user.totalQuizzesTaken` increment at line 515 (already done in `awardQuizTokens`).
2. **`professionalQuizController.js`** — Add `user.totalQuizzesTaken++`, `user.perfectScores++`, and `checkAndAwardAchievements()` call in `submitProfessionalQuiz`.
3. **`flashcardController.js`** — Add `user.totalStudyHours` update in `studyFlashcard`.

### Recommended (data integrity)
4. **`User.js`** — Align level curve: pick one formula (server's linear or client's exponential) and use it everywhere.
5. **`GameContext.tsx`** — Sync `totalPoints` to server periodically or on key events.

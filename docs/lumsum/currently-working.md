# Currently Working On

## Achievements Section — Verification & Fixes

- **Fix achievement unlock logic** — ensure `achievementChecker.js` correctly evaluates all criteria (study hours, quizzes, games, streaks, perfect scores)
- **Verify badge display** on Progress page — achievements should show correct progress, unlock status per category
- **Cross-page notification** — newly unlocked achievements from Quiz/ProfessionalQuiz pages should appear on Progress page via localStorage bridge
- **Offline/cache fallback** — when server is unavailable, show cached achievements with a "cached data" banner
- **Categorization** — ensure backend `category` values (`study`, `quiz`, `game`, `community`, `streak`, `special`) map to frontend categories (`learning`, `social`, `exploration`, `mastery`)
- **Test with real API responses** — verify end-to-end: take a quiz → earn achievement → see it on Progress page

## Known Issues on Achievements

1. **`Quiz Master` achievement logic broken** — `achievementChecker.js:52-62` uses two separate `if` blocks for `quizzesTaken` and `perfectScores`. The second overwrites the first, so the AND condition (100 quizzes + 50 perfect scores) never evaluates correctly
2. **`Card Reader` achievements rely on name matching** — seed data has all-zero `requirements`; `checkFlashcardAchievements` uses hardcoded name checks (`card reader i`, etc.) — fragile if names change
3. **`perfectScores` field on User model never incremented** — added to schema but no controller updates it; checker recomputes by scanning all quiz attempts every time

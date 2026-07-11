# Issues Fixed

## Backend

### Professional Quiz Controller
- **AI quizzes made private** — public listing now excludes AI-generated quizzes (`isAIGenerated: { $ne: true }`)
- **Added `getMyAIQuizzes`** — returns only the authenticated user's own AI quizzes
- **Added `deleteMyAIQuiz`** — soft-deletes (`isActive = false`) AI quiz; preserves attempts, progress, tokens, and achievements
- **Question count limit** — `totalQuestions` validated on both backend (3–50) and frontend; prevents abuse via direct API calls
- **Route ordering fixed** — `/my-ai` and `/my-attempts` placed before `/:id` to prevent Express param matching
- **Added pagination** (`page`, `limit`) to `getProfessionalQuizzes` — prevents loading all quizzes at once
- **Fixed grade filtering** — now reads student's grade from `x-user-info` header; removed query-based grade param
- **Added `total` count** in response for frontend pagination
- **Refactored statistics calculation** — moved to reusable `getStatistics()` model method, eliminating inline duplication in `submitProfessionalQuiz`

### User Controller
- **Fixed `getUserAchievements`** — was querying `Achievement` collection by `earnedBy.user` (wrong schema). Now reads from `User.achievements` populated field

### Professional Quiz Model
- **Added `getStatistics()` method** — centralized stats logic (totalAttempts, averageScore, totalPassed, passRate, averageTime)

### Progress Model
- **Added `flashcard`** to `completedActivities` type enum

### User Model
- **Added `totalFlashcardsRead`** and **`perfectScores`** fields — needed for flashcard tracking and achievement progress

### Server.js
- **Removed duplicate quiz seeding** — inlined ProfessionalQuiz seed data was bloating server.js; quizzes are now created via admin flow

### Achievement Checker
- **Fixed `special` category logic** — no longer hardcodes name checks (`Learner`, `Scholar`). Now uses `requirements.studyHours` properly

## Frontend

### App.tsx
- **Removed duplicate route** — `/professional-quizzes` had both a `<Navigate>` redirect and a standalone route. Kept only the redirect

### Navbar.tsx
- **Comment out duplicate "Professional Quizzes"** navigation link that went to `/quizzes` — was redundant with "Quizzes" link

### GameContext.tsx
- **Extracted achievement types, defaults, and mapping** into shared `utils/achievements.ts` — reduces duplication and enables caching
- **Removed inline `CATEGORY_MAP`** and achievement list — now imported from shared module

### ProfessionalQuiz.tsx
- **Better error handling** — shows "Quiz not found" when data is missing
- **Auth check** — shows login/register modal if user is not authenticated before starting quiz
- **Removed duplicate XP award** — `addExperience` was called client-side but XP is awarded server-side

### AdminPanel.tsx
- **Pro Quiz question builder** — create and edit modals now include a full question builder (add/remove questions, set options + correct answer); previously submitted quizzes with zero questions

### ProfessionalQuizzes.tsx
- **Pagination** — "Load More" button instead of loading all quizzes at once
- **Dynamic subjects** — fetches subjects list from API instead of hardcoding 4 subjects
- **Auth gate** — shows login modal for unauthenticated users trying to start a quiz
- **Live pass rate** — shows computed average pass rate instead of hardcoded `78%`
- **AbortController** — cancels stale requests when filters change

### Quiz.tsx
- **New achievement notification bridge** — stores newly unlocked achievements in localStorage so Progress page can display them

### Progress.tsx
- **Refactored to use shared `utils/achievements.ts`** — centralized achievement fetching, mapping, caching
- **Offline cache** — shows cached achievements when server is unavailable, with a blue info banner
- **Category labels** — uses shared `CATEGORY_LABELS` instead of hardcoded array
- **New achievement popup** — calls `consumeNewAchievements()` to show freshly unlocked badges

### API layer
- **`professionalQuizAPI.getQuizzes`** — now accepts `AbortSignal` for request cancellation
- **`api.js`** — passes `signal` option through to axios

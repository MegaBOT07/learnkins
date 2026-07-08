# Changelog — Achievement System

## 2026-07-07

### Backend Changes

| File | Change |
|------|--------|
| `backend/src/models/User.js` | Added `totalFlashcardsRead` (Number, default 0) and `perfectScores` (Number, default 0) fields to schema. These were being used by controllers but missing from schema — data was silently lost on save. |
| `backend/src/models/Progress.js` | Added `'flashcard'` to `completedActivities.type` enum. Previously only `['video', 'quiz', 'material', 'game']` were allowed, causing Mongoose validation errors when `flashcardController.js` pushed `type: 'flashcard'`. |
| `backend/src/controllers/userController.js` | Fixed `getUserAchievements` endpoint: replaced `Achievement.find({'earnedBy.user': id})` with `User.findById(id).populate('achievements')`. The `earnedBy` field does not exist on the Achievement schema, so the query always returned empty. |
| `backend/src/utils/achievementChecker.js` | Removed fragile name-matching logic for "Dedicated Learner" and "Scholar" achievements (`achievement.name.includes('Learner')` / `'Scholar'`). Replaced with standard `requirements.studyHours` check in the `case 'special'` block. |
| `backend/src/seeds/seedAchievements.js` | Set `requirements: { studyHours: 10 }` on "Dedicated Learner" and `requirements: { studyHours: 50 }` on "Scholar" so the checker can evaluate them through the standard requirements system instead of name-matching. |

### Frontend — New File

| File | Purpose |
|------|---------|
| `project/src/utils/achievements.ts` | **Shared utility** containing: `CATEGORY_MAP` (backend→frontend category mapping), `mapBackendToFrontend()` mapper function, cache helpers (`ACHIEVEMENT_CACHE_KEY`, `getCachedAchievements`, `setCachedAchievements`, `clearAchievementCache`, `isCacheValid`) with 24h TTL, `defaultAchievements` fallback array (7 items), `storeNewAchievements` / `consumeNewAchievements` localStorage bridge for cross-page notifications, and `fetchAchievementsWithCache` wrapper. |

### Frontend — Modified Files

| File | Change |
|------|--------|
| `project/src/pages/progress/Progress.tsx` | Replaced `userAPI.getUser()` (which returned raw ObjectId arrays for achievements) with `fetchAchievementsWithCache()` using `communityAPI.getAchievements()` + `communityAPI.getUserAchievements()` + proper merging. Category filter now uses frontend categories (`learning`, `social`, `exploration`, `mastery`) instead of backend values. Added `consumeNewAchievements()` on mount for notification banner. Added cache indicator banner. |
| `project/src/context/GameContext.tsx` | Replaced inline `defaultAchievements` (7 hardcoded), `CATEGORY_MAP`, and `mapBackendAchievements` with imports from shared utility. Removed duplicate `Achievement` interface in favor of `FrontendAchievement`. |
| `project/src/pages/assessment/Quiz.tsx` | Added `storeNewAchievements()` call after quiz submission to bridge new achievements to the Progress page via localStorage. |

### Documentation

| File | Content |
|------|---------|
| `docs/ACHIEVEMENTS.md` | Full system documentation: architecture overview, DB models, API reference with response examples, achievement trigger mapping, Postman testing guide, frontend file reference, cache strategy, category mapping table. |
| `CHANGELOG.md` | This file — every change documented with rationale. |

### Tests

| File | Content |
|------|---------|
| `backend/tests/fixtures/seedData.json` | Seed data for empty DB: 24 achievements matching `seedAchievements.js` structure + sample user data. |
| `backend/tests/achievements.test.js` | Integration tests for: achievement schema validation, achievement checker logic, API endpoint behavior, edge cases. |

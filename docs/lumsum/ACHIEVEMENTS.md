# Achievement System — Documentation

## Architecture Overview

```
Frontend (React/TypeScript)                Backend (Node.js/Express/MongoDB)
─────────────────────────────              ────────────────────────────────────

Progress.tsx                               Achievement Model
GameContext.tsx            ──API calls──▶  User Model (achievements[], points, 
Community.tsx                               totalStudyHours, etc.)
ProfilePage.tsx                            Progress Model
                                           achievementChecker.js
                                           seedAchievements.js
```

**Data Flow:**
1. User performs action (quiz submit, game score, study session, etc.)
2. Backend controller calls `checkAndAwardAchievements(userId)` or `checkFlashcardAchievements(userId, count)`
3. Checker compares user stats against all active achievement requirements
4. Newly unlocked achievements are pushed to `user.achievements[]` + points added
5. Response includes `newAchievements[]` array
6. Frontend picks up new achievements via localStorage bridge and displays on Progress page

**Caching Strategy:**
- On successful API fetch → save to `learnkins-achievement-cache` (localStorage, 24h TTL)
- On API failure → use cached data if valid
- No cache → fall back to hardcoded default achievements
- Cache indicator shows "Using cached data" banner

---

## Database Models

### Achievement Schema (`backend/src/models/Achievement.js`)

| Field | Type | Notes |
|-------|------|-------|
| `name` | String (required, max 100) | Display name |
| `description` | String (required, max 500) | Description text |
| `icon` | String (required) | Emoji character |
| `rarity` | String (enum) | Common, Uncommon, Rare, Epic, Legendary |
| `points` | Number (1-1000) | Points awarded on unlock |
| `criteria` | String (required) | Human-readable unlock condition |
| `category` | String (enum) | study, quiz, game, community, streak, special |
| `requirements` | Object | `{ studyHours, quizzesTaken, gamesPlayed, streakDays, perfectScores, communityPosts }` |
| `isActive` | Boolean (default: true) | Inactive achievements are not checked |
| `isSecret` | Boolean (default: false) | Hidden until unlocked |

### User Achievement Fields (`backend/src/models/User.js`)

| Field | Type | Notes |
|-------|------|-------|
| `achievements[]` | [ObjectId] | References to earned Achievement documents |
| `points` | Number | Aggregate score from achievements |
| `totalStudyHours` | Number | Accumulated study time |
| `totalQuizzesTaken` | Number | Quiz attempts count |
| `totalGamesPlayed` | Number | Game plays count |
| `totalFlashcardsRead` | Number | Flashcards studied count |
| `perfectScores` | Number | 100% quiz scores count |
| `currentStreak` | Number | Consecutive daily login days |
| `longestStreak` | Number | Best streak achieved |
| `communityPosts` | Number | Discussion/reply count |
| `level` | Number | User level (from experience) |

### Progress Model (`backend/src/models/Progress.js`)

| Field | Type | Notes |
|-------|------|-------|
| `completedActivities[].type` | String (enum) | `video`, `quiz`, `material`, `game`, `flashcard` |
| `streak.current` | Number | Per-subject streak (separate from user-level streak) |

---

## API Reference

### Achievements

#### `GET /api/community/achievements`
List all achievements (sorted by points descending).

**Response:**
```json
{
  "success": true,
  "achievements": [
    {
      "_id": "...",
      "name": "Card Reader I",
      "description": "Read your first 10 flashcards",
      "icon": "📖",
      "rarity": "Common",
      "points": 10,
      "category": "study",
      "requirements": { "studyHours": 0, "quizzesTaken": 0, ... }
    }
  ]
}
```

#### `GET /api/community/achievements/user`
Get authenticated user's earned achievements (populated with full data).

**Auth:** Private (token required)

**Response:**
```json
{
  "success": true,
  "achievements": [
    {
      "_id": "...",
      "name": "Card Reader I",
      "description": "Read your first 10 flashcards",
      ...
    }
  ]
}
```

#### `GET /api/users/:id/achievements`
Get achievements for a specific user by ID.

**Auth:** Private

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [ ... populated achievements ... ]
}
```

#### `POST /api/community/achievements/:id/award`
Manually award an achievement to self.

**Auth:** Private (no admin check — any authenticated user can call)

**Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Achievement awarded successfully",
  "data": {
    "achievement": { ... },
    "points": 50,
    "totalPoints": 150
  }
}
```

### Trigger Endpoints (return `newAchievements[]`)

#### `POST /api/quizzes/:id/submit`
Submit quiz answers. Returns `newAchievements[]` at root level.

**Response shape:**
```json
{
  "success": true,
  "data": { "correctCount": 10, "percentage": 100, "passed": true, ... },
  "newAchievements": [ { "_id": "...", "name": "Perfect Score I", ... } ]
}
```

#### `POST /api/games/:id/score`
Submit game score. Returns `newAchievements[]` at root level.

#### `PUT /api/progress/update`
Update study progress. Returns `newAchievements[]` inside `data.newAchievements`.

#### `POST /api/flashcards/:id/study`
Study a flashcard. Returns `newAchievements[]` alongside response.

#### `POST /api/tokens/claim`
Claim daily reward. Returns `newAchievements[]` alongside response.

---

## Achievement Trigger Mapping

| User Action | API Endpoint | Achievements Checked |
|-------------|-------------|---------------------|
| Submit quiz | `POST /api/quizzes/:id/submit` | Quiz Taker I-III, Perfect Score I-II, Quiz Master |
| Play game | `POST /api/games/:id/score` | Gamer I-III, Game Master |
| Study flashcards | `POST /api/flashcards/:id/study` | Card Reader I-III, Card Master |
| Update progress | `PUT /api/progress/update` | Dedicated Learner, Scholar |
| Claim daily reward | `POST /api/tokens/claim` | Streak I-III, Streak Legend |
| Create discussion | `POST /api/community/discussions` | Community Contributor |
| Reach level 5/10/20 | (auto-checked on quiz/game/progress) | Level 5, Level 10, Level 20 |

---

## Postman Testing Guide

### Setup

1. **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Achievements auto-seed** on first server start (if DB is empty). Verify:
   ```
   GET http://localhost:5000/api/community/achievements
   ```
   Should return 24 achievements.

3. **Create a user:**
   ```
   POST http://localhost:5000/api/auth/register
   Body (JSON): { "name": "Test Student", "email": "test@test.com", "password": "password123", "role": "student", "grade": "6th" }
   ```

4. **Login and copy token:**
   ```
   POST http://localhost:5000/api/auth/login
   Body (JSON): { "email": "test@test.com", "password": "password123" }
   ```
   Copy the `token` from response. Add as `Authorization: Bearer <token>` header for all subsequent requests.

### Test Achievement Unlocks

#### Test 1: Quiz Achievement
1. Create a quiz (or use seeded one):
   ```
   GET http://localhost:5000/api/quizzes
   ```
2. Submit quiz with enough correct answers to pass:
   ```
   POST http://localhost:5000/api/quizzes/<quizId>/submit
   Body: { "answers": [...], "timeTaken": 60 }
   ```
3. Check `newAchievements` in response.
4. Verify:
   ```
   GET http://localhost:5000/api/community/achievements/user
   ```

#### Test 2: Study Hours Achievement
1. Update progress to accumulate study hours:
   ```
   PUT http://localhost:5000/api/progress/update
   Body: { "subject": "science", "chapter": "ch1", "progress": 50, "timeSpent": 600 }
   ```
   (600 minutes = 10 hours)
2. "Dedicated Learner" should unlock.

#### Test 3: Streak Achievement
```
POST http://localhost:5000/api/tokens/claim
```
Call this 3+ consecutive days (or modify `user.currentStreak` directly in DB).

### Test Cache Fallback (Frontend)

1. Load Progress page with server running → full data shown
2. Stop server, reload Progress page → should show cached data with blue banner
3. Clear localStorage → should show default achievements

---

## Frontend File Reference

| File | Role |
|------|------|
| `src/utils/achievements.ts` | Shared mapper, cache, newAchievement bridge |
| `src/utils/api.js` | API wrappers for all endpoints |
| `src/context/GameContext.tsx` | Global game progress state (uses shared mapper) |
| `src/pages/progress/Progress.tsx` | Progress dashboard (uses caching) |
| `src/pages/assessment/Quiz.tsx` | Quiz page (stores newAchievements to localStorage) |
| `src/pages/community/Community.tsx` | Community achievements tab |
| `src/pages/profile/ProfilePage.tsx` | Profile achievements section |
| `src/components/features/achievements/AchievementCard.tsx` | Achievement card UI |

---

## Running Tests

```bash
cd backend
npm test -- --grep achievements
```

Or run specific test file:
```bash
npx mocha tests/achievements.test.js --require @babel/register
```

---

## Category Mapping

| Backend Category | Frontend Category | Description |
|-----------------|-------------------|-------------|
| `study` | `learning` | Flashcards, study hours |
| `quiz` | `learning` | Quiz completions |
| `game` | `learning` | Game plays |
| `community` | `social` | Community participation |
| `streak` | `mastery` | Daily streaks |
| `special` | `exploration` | Levels, total study hours |

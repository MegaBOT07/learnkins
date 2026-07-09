# Game Achievements Integration

## Problem

The achievement system had two disconnected pieces:

1. **Backend** (`gameController.submitScore`) — already checks achievements via `checkAndAwardAchievements`, increments `totalGamesPlayed`, and awards XP/tokens. But it was never called from any frontend game.

2. **Frontend games** (EnhancedHistoryGame, GrammarWarrior, WordBuilder, VirtualLab) — all standalone components with no backend communication. They tracked play count only in local state (`GameContext.gamesPlayed`), which was never synced to the server.

**Result:** Game achievements (Gamer I-III, Game Master, etc.) could never unlock because `User.totalGamesPlayed` stayed at 0 on the backend.

## What Changed

### New: `useGameProgress` hook (`project/src/hooks/useGameProgress.ts`)

A shared hook that any game component can use. It:

- **`startGame()`** — calls `GameContext.playGame()` + `logActivity(3)` for local tracking
- **`completeGame(score, maxScore, difficulty)`** — awards local XP/tokens, then fires a background sync to the backend
- **`completeWithTokenBonus()`** — same but with extra token bonus
- **Backend sync** — calls `POST /api/progress/game-activity` which:
  - Increments `User.totalGamesPlayed`
  - Runs `checkAndAwardAchievements()`
  - Returns newly-earned achievements via `storeNewAchievements()` (localStorage bridge)

### New: Backend endpoint `POST /api/progress/game-activity`

**File:** `backend/src/controllers/progressController.js` (new function `logGameActivity`)

**Route:** `backend/src/routes/progress.js` (line 24)

**Request body:**
```json
{ "gameTitle": "Time Traveling History", "score": 450, "maxScore": 500, "difficulty": "Hard" }
```

**Response:**
```json
{ "success": true, "newAchievements": [...] }
```

### Updated Game Components

| Component | File | Trigger | Completion Check |
|-----------|------|---------|-----------------|
| EnhancedHistoryGame | `.../HistoryGame/EnhancedHistoryGame.tsx` | `startTimeTravel()` | `gameState === "gameOver" \|\| "lostInTime"` |
| GrammarWarrior | `.../GrammarWarrior/GrammarWarrior.tsx` | `startGame(planetKey)` | `gameState === "victory" \|\| "defeat"` |
| WordBuilder | `.../WordBuilder/WordBuilder.tsx` | `startGame()` | `gameState === "result"` |
| VirtualLab | `.../VirtualLab/VirtualLab.jsx` | First zone detected | Each experiment completed |

### Updated: `project/src/utils/api.js`

Added `progressAPI.logGameActivity()`.

## Architecture

```
Game Component
  │
  ├── startGame() ──► GameContext.playGame()  (local counter)
  │
  └── completeGame()
        ├── GameContext.addExperience()       (local XP)
        ├── GameContext.addPoints()           (local points)
        ├── TokenContext.award()              (local + backend tokens)
        └── progressAPI.logGameActivity() ──► Backend
                                              ├── User.totalGamesPlayed++
                                              ├── checkAndAwardAchievements()
                                              └── storeNewAchievements()     (cross-page notification)
```

## Data Flow

| Step | Action | Location | Effect |
|------|--------|----------|--------|
| 1 | User plays game → completes it | Game component | `completeGame()` called |
| 2 | Local XP/tokens awarded | GameContext/TokenContext | Immediate UI update |
| 3 | `POST /api/progress/game-activity` | Background async | Increments `totalGamesPlayed` |
| 4 | `checkAndAwardAchievements()` | Backend | Unlocks game achievements if thresholds met |
| 5 | New achievements → localStorage bridge | `storeNewAchievements()` | Progress page shows them on next visit |

## Files Changed

| File | Change |
|------|--------|
| `project/src/hooks/useGameProgress.ts` | **New** — shared game progress hook with backend sync |
| `project/src/components/games/HistoryGame/EnhancedHistoryGame.tsx` | Added `useGameProgress` integration |
| `project/src/components/games/GrammarWarrior/GrammarWarrior.tsx` | Added `useGameProgress` integration |
| `project/src/components/games/WordBuilder/WordBuilder.tsx` | Added `useGameProgress` integration |
| `project/src/components/games/VirtualLab/VirtualLab.jsx` | Added `useGameProgress` integration |
| `backend/src/controllers/progressController.js` | New `logGameActivity` endpoint |
| `backend/src/routes/progress.js` | Added route for `game-activity` |
| `project/src/utils/api.js` | Added `progressAPI.logGameActivity()` |

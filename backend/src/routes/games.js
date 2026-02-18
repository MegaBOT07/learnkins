import express from 'express';
import {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  playGame,
  submitScore,
  getLeaderboard
} from '../controllers/gameController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getGames);
router.get('/:id', getGame);
router.get('/:id/leaderboard', getLeaderboard);

// Protected routes
router.use(protect);

// Student routes
router.post('/:id/play', playGame);
router.post('/:id/score', submitScore);

// Teacher/Admin routes
router.post('/', authorize('admin', 'teacher'), createGame);
router.put('/:id', authorize('admin', 'teacher'), updateGame);
router.delete('/:id', authorize('admin', 'teacher'), deleteGame);

export default router;
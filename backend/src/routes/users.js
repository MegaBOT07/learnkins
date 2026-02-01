import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProgress,
  getUserAchievements
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all users (admin only)
router.get('/', authorize('admin'), getUsers);

// Get user by ID
router.get('/:id', getUser);

// Update user
router.put('/:id', updateUser);

// Delete user (admin only)
router.delete('/:id', authorize('admin'), deleteUser);

// Get user progress
router.get('/:id/progress', getUserProgress);

// Get user achievements
router.get('/:id/achievements', getUserAchievements);

export default router;
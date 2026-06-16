import express from 'express';
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResults,
  getQuizStatistics
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getQuizzes);
router.get('/:id', getQuiz);

// Protected routes
router.use(protect);

// Student routes
router.post('/:id/submit', submitQuiz);
router.get('/:id/results', getQuizResults);

// Teacher/Admin routes
router.post('/', authorize('admin', 'teacher'), createQuiz);
router.put('/:id', authorize('admin', 'teacher'), updateQuiz);
router.delete('/:id', authorize('admin', 'teacher'), deleteQuiz);
router.get('/:id/statistics', authorize('admin', 'teacher'), getQuizStatistics);

export default router;
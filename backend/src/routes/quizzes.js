import express from 'express';
import {
  getHomepageQuizCards,
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizResults,
  getQuizStatistics,
  getSubjects,
  getLeaderboard
} from '../controllers/quizController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/homepageQuizCards', getHomepageQuizCards)

// Protected routes
router.use(protect);

// Student routes
router.get('/leaderboard', getLeaderboard);
router.get('/', getQuizzes);
router.get('/subjects', getSubjects);
router.post('/:id/submit', submitQuiz);
router.get('/:id/results', getQuizResults);
router.get('/:id', getQuiz);

// Teacher/Admin routes
router.post('/', authorize('admin', 'teacher'), createQuiz);
router.put('/:id', authorize('admin', 'teacher'), updateQuiz);
router.delete('/:id', authorize('admin', 'teacher'), deleteQuiz);
router.get('/:id/statistics', authorize('admin', 'teacher'), getQuizStatistics);

export default router;
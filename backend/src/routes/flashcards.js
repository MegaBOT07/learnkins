import express from 'express';
import {
  getFlashcards,
  getFlashcard,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  studyFlashcard,
  rateFlashcard,
  getMyFlashcards,
  getPopularFlashcards,
  getRecentFlashcards,
  searchFlashcards,
  generateAIFlashcards
} from '../controllers/flashcardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getFlashcards);
router.get('/popular', getPopularFlashcards);
router.get('/recent', getRecentFlashcards);
router.get('/search', searchFlashcards);

// AI flashcard generation – authentication required but produces a clean error if missing
router.post('/ai-generate', (req, res, next) => {
  protect(req, res, (err) => {
    if (err) {
      // Auth error – return a user-friendly message, not an internal token error
      return res.status(401).json({
        success: false,
        message: 'Please log in to use AI flashcard generation.',
      });
    }
    next();
  });
}, generateAIFlashcards);

// Protected routes (must be logged in)
router.use(protect);

// User flashcards
router.get('/my/flashcards', getMyFlashcards);

// CRUD operations (admin/teacher only)
router.post('/', authorize('admin', 'teacher'), createFlashcard);
router.put('/:id', authorize('admin', 'teacher'), updateFlashcard);
router.delete('/:id', authorize('admin', 'teacher'), deleteFlashcard);

// Study and rating
router.post('/:id/study', studyFlashcard);
router.post('/:id/rate', rateFlashcard);

// Must be last to avoid shadowing named routes above
router.get('/:id', getFlashcard);

export default router;
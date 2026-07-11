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
  generateAIFlashcards,
  batchCreateFlashcards
} from '../controllers/flashcardController.js';
import { protect, optionalAuth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional auth so private cards show for their owners)
router.get('/', optionalAuth, getFlashcards);
router.get('/popular', getPopularFlashcards);
router.get('/recent', getRecentFlashcards);
router.get('/search', searchFlashcards);
router.get('/:id', getFlashcard);

// Protected routes
router.use(protect);

// AI flashcard generation
router.post('/ai-generate', generateAIFlashcards);

// Batch create flashcards (for saving AI-generated cards)
router.post('/batch', batchCreateFlashcards);

// User flashcards
router.get('/my/flashcards', getMyFlashcards);

// CRUD operations (admin/teacher only)
router.post('/', authorize('admin', 'teacher'), createFlashcard);
router.put('/:id', authorize('admin', 'teacher'), updateFlashcard);

// Delete — any authenticated user can delete their own cards (controller checks ownership)
router.delete('/:id', deleteFlashcard);

// Study and rating
router.post('/:id/study', studyFlashcard);
router.post('/:id/rate', rateFlashcard);

export default router;
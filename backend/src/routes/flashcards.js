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
  searchFlashcards
} from '../controllers/flashcardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getFlashcards);
router.get('/popular', getPopularFlashcards);
router.get('/recent', getRecentFlashcards);
router.get('/search', searchFlashcards);
router.get('/:id', getFlashcard);

// Protected routes
router.use(protect);

// User flashcards
router.get('/my/flashcards', getMyFlashcards);

// CRUD operations
router.post('/', createFlashcard);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);

// Study and rating
router.post('/:id/study', studyFlashcard);
router.post('/:id/rate', rateFlashcard);

export default router;
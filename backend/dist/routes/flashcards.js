import express from 'express';
import { getFlashcards, getFlashcard, createFlashcard, updateFlashcard, deleteFlashcard, studyFlashcard, rateFlashcard, getMyFlashcards, getPopularFlashcards, getRecentFlashcards, searchFlashcards, generateAIFlashcards } from '../controllers/flashcardController.js';
import { protect, authorize } from '../middleware/auth.js';
const router = express.Router();

// Public routes
router.get('/', getFlashcards);
router.get('/popular', getPopularFlashcards);
router.get('/recent', getRecentFlashcards);
router.get('/search', searchFlashcards);
router.get('/:id', getFlashcard);

// Protected routes
router.use(protect);

// AI flashcard generation
router.post('/ai-generate', generateAIFlashcards);

// User flashcards
router.get('/my/flashcards', getMyFlashcards);

// CRUD operations (admin/teacher only)
router.post('/', authorize('admin', 'teacher'), createFlashcard);
router.put('/:id', authorize('admin', 'teacher'), updateFlashcard);
router.delete('/:id', authorize('admin', 'teacher'), deleteFlashcard);

// Study and rating
router.post('/:id/study', studyFlashcard);
router.post('/:id/rate', rateFlashcard);
export default router;
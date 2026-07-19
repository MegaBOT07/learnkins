import express from 'express';
import { getProfessionalQuizzes, getProfessionalQuiz, createProfessionalQuiz, createAIQuiz, updateProfessionalQuiz, deleteProfessionalQuiz, deleteMyAIQuiz, submitProfessionalQuiz, getUserAttempts, getAllUserAttempts, getMyAIQuizzes } from '../controllers/professionalQuizController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

// Public routes — specific paths BEFORE /:id
router.get('/', getProfessionalQuizzes);
router.get('/my-ai', protect, getMyAIQuizzes);
router.get('/my-attempts', protect, getAllUserAttempts);
router.get('/:id', getProfessionalQuiz);

// Private routes (authenticated users) — specific paths BEFORE /:id
router.delete('/my-ai/:id', protect, deleteMyAIQuiz);
router.post('/ai-generate', protect, createAIQuiz);
router.post('/:id/submit', protect, submitProfessionalQuiz);
router.get('/:id/attempts', protect, getUserAttempts);

// Admin routes
router.post('/', protect, createProfessionalQuiz);
router.put('/:id', protect, updateProfessionalQuiz);
router.delete('/:id', protect, deleteProfessionalQuiz);
export default router;
import express from 'express';
import {
  getProfessionalQuizzes,
  getProfessionalQuiz,
  createProfessionalQuiz,
  createAIQuiz,
  updateProfessionalQuiz,
  deleteProfessionalQuiz,
  submitProfessionalQuiz,
  getUserAttempts,
  getAllUserAttempts
} from '../controllers/professionalQuizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProfessionalQuizzes);
router.get('/my-attempts', protect, getAllUserAttempts);
router.get('/:id', getProfessionalQuiz);

// Private routes (authenticated users)
router.post('/:id/submit', protect, submitProfessionalQuiz);
router.get('/:id/attempts', protect, getUserAttempts);
router.post('/ai-generate', protect, createAIQuiz);

// Admin routes
router.post('/', protect, createProfessionalQuiz);
router.put('/:id', protect, updateProfessionalQuiz);
router.delete('/:id', protect, deleteProfessionalQuiz);

export default router;

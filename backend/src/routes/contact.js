import express from 'express';
import { body } from 'express-validator';
import {
  submitContactForm,
  getContactMessages,
  updateMessageStatus
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters'),
  body('category').isIn(['general', 'technical', 'parental', 'billing', 'feedback']).withMessage('Invalid category')
];

// Public routes
router.post('/', contactValidation, submitContactForm);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/', getContactMessages);
router.put('/:id/status', updateMessageStatus);

export default router;
import express from 'express';
import {
  getPlans,
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/plans', getPlans);

// All other payment routes require authentication
router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

export default router;

import express from 'express';
import { protect } from '../middleware/auth.js';
import { getBalance, getTransactions, awardTokens, redeemTokens } from '../controllers/tokenController.js';

const router = express.Router();

router.get('/balance', protect, getBalance);
router.get('/transactions', protect, getTransactions);
router.post('/award', protect, awardTokens);
router.post('/redeem', protect, redeemTokens);

export default router;

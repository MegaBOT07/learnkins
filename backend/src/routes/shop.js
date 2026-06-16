import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getShopItems, purchaseItem, getMyPurchases,
  createShopItem, updateShopItem, deleteShopItem, getAdminShopStats,
} from '../controllers/shopController.js';

const router = express.Router();

// Public / authenticated browsing
router.get('/', protect, getShopItems);
router.get('/my-purchases', protect, getMyPurchases);
router.post('/:id/purchase', protect, purchaseItem);

// Admin management
router.post('/', protect, authorize('admin'), createShopItem);
router.put('/:id', protect, authorize('admin'), updateShopItem);
router.delete('/:id', protect, authorize('admin'), deleteShopItem);
router.get('/admin/stats', protect, authorize('admin'), getAdminShopStats);

export default router;

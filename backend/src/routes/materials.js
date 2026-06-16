import express from 'express';
import multer from 'multer';
import {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  searchMaterials
} from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Public routes
router.get('/', getMaterials);
router.get('/search', searchMaterials);
router.get('/:id', getMaterial);
router.get('/:id/download', downloadMaterial);

// Protected routes
router.use(protect);

router.post('/', authorize('admin', 'teacher'), upload.single('file'), createMaterial);
router.put('/:id', authorize('admin', 'teacher'), updateMaterial);
router.delete('/:id', authorize('admin', 'teacher'), deleteMaterial);

export default router;
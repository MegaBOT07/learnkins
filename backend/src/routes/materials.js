import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  searchMaterials,
  viewMaterial
} from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads — store with original extension
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Public routes
router.get('/', getMaterials);
router.get('/search', searchMaterials);
router.get('/:id', getMaterial);
router.get('/:id/download', downloadMaterial);
router.get('/:id/view', viewMaterial);

// Protected routes
router.use(protect);

router.post('/', authorize('admin', 'teacher'), upload.single('file'), createMaterial);
router.put('/:id', authorize('admin', 'teacher'), updateMaterial);
router.delete('/:id', authorize('admin', 'teacher'), deleteMaterial);

export default router;
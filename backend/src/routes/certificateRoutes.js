import express from 'express';
import multer from 'multer';
import {
  createCertificate,
  getCertificates,
  deleteCertificate,
  bulkCreateCertificates,
} from '../controllers/certificateController.js';
import { protect, authorize } from '../middleware/auth.js';

import fs from 'fs';

const router = express.Router();

const tempDir = 'uploads/temp/';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
const upload = multer({ dest: tempDir });

router
  .route('/')
  .post(protect, authorize('admin'), createCertificate)
  .get(protect, authorize('admin'), getCertificates);

router
  .route('/bulk')
  .post(protect, authorize('admin'), upload.single('file'), bulkCreateCertificates);

router
  .route('/:id')
  .delete(protect, authorize('admin'), deleteCertificate);

export default router;

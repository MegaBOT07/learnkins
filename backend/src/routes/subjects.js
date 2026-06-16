import express from 'express';
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectChapters,
  addChapter,
  updateChapter,
  deleteChapter
} from '../controllers/subjectController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getSubjects);
router.get('/:slug', getSubject);
router.get('/:slug/chapters', getSubjectChapters);

// Protected routes (admin/teacher only)
router.use(protect);
router.use(authorize('admin', 'teacher'));

router.post('/', createSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);

// Chapter routes
router.post('/:subjectId/chapters', addChapter);
router.put('/:subjectId/chapters/:chapterId', updateChapter);
router.delete('/:subjectId/chapters/:chapterId', deleteChapter);

export default router;
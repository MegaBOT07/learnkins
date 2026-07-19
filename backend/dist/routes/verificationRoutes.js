import express from "express";
const router = express.Router();
import { verifyCertificate } from "../controllers/verificationController.js";
router.get('/:certificateId', verifyCertificate);
export default router;
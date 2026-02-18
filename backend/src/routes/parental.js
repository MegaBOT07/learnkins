import express from "express";
import { body } from "express-validator";
import {
  getChildren,
  getControls,
  setTimeControls,
  setContentFilters,
  getChildProgress,
  getChildActivity,
  getSessionLogs,
} from "../controllers/parentalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateTimeControls = [
  body("dailyLimit")
    .optional()
    .isInt({ min: 1, max: 8 })
    .withMessage("Daily limit must be between 1 and 8 hours"),
  body("breakReminder")
    .optional()
    .isInt({ min: 15, max: 60 })
    .withMessage("Break reminder must be between 15 and 60 minutes"),
  body("bedtimeRestriction")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Bedtime must be in HH:MM format"),
  body("weekendBonus")
    .optional()
    .isInt({ min: 0, max: 3 })
    .withMessage("Weekend bonus must be between 0 and 3 hours"),
];

const validateContentFilters = [
  body("allowedSubjects")
    .optional()
    .isArray()
    .withMessage("Allowed subjects must be an array"),
  body("allowedSubjects.*")
    .optional()
    .isString()
    .withMessage("Each subject must be a string"),
  body("communityAccess")
    .optional()
    .isBoolean()
    .withMessage("Community access must be a boolean"),
  body("gamingTime")
    .optional()
    .isFloat({ min: 0, max: 4 })
    .withMessage("Gaming time must be between 0 and 4 hours"),
];

// All routes require authentication
router.use(protect);

// Get all children
router.get("/children", getChildren);

// Get parental controls for a child
router.get("/:childId", getControls);

// Update time controls
router.put("/:childId/time-controls", validateTimeControls, setTimeControls);

// Update content filters
router.put(
  "/:childId/content-filters",
  validateContentFilters,
  setContentFilters
);

// Get child progress
router.get("/:childId/progress", getChildProgress);

// Get child activity
router.get("/:childId/activity", getChildActivity);

// Get session logs
router.get("/:childId/session-logs", getSessionLogs);

export default router;

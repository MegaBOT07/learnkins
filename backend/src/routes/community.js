import express from "express";
import { body } from "express-validator";
import {
  getDiscussions,
  createDiscussion,
  likeDiscussion,
  getStudyGroups,
  createStudyGroup,
  joinStudyGroup,
  getAchievements,
  getUserAchievements,
  awardAchievement,
  getCommunityStats,
} from "../controllers/communityController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateDiscussion = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Content must be between 10 and 5000 characters"),
  body("category")
    .optional()
    .isIn(["general", "mathematics", "science", "english", "social-science"])
    .withMessage("Invalid category"),
  body("tags")
    .optional()
    .isArray({ max: 5 })
    .withMessage("Tags must be an array with maximum 5 items"),
  body("tags.*")
    .optional()
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Each tag must be between 1 and 20 characters"),
];

const validateStudyGroup = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Group name must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("subject")
    .isIn([
      "mathematics",
      "science",
      "english",
      "social-science",
      "computer-science",
      "art-craft",
    ])
    .withMessage("Invalid subject"),
  body("maxMembers")
    .optional()
    .isInt({ min: 2, max: 50 })
    .withMessage("Maximum members must be between 2 and 50"),
];

// Public routes
router.get("/discussions", getDiscussions);
router.get("/groups", getStudyGroups);
router.get("/achievements", getAchievements);
router.get("/stats", getCommunityStats);

// Protected routes
router.use(protect);

// Discussion routes
router.post("/discussions", validateDiscussion, createDiscussion);
router.post("/discussions/:id/like", likeDiscussion);

// Study group routes
router.post("/groups", validateStudyGroup, createStudyGroup);
router.post("/groups/:id/join", joinStudyGroup);

// Achievement routes
router.get("/achievements/user", getUserAchievements);
router.post("/achievements/:id/award", awardAchievement);

export default router;

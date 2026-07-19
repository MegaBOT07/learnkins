import express from "express";
import { body } from "express-validator";
import { getDiscussions, createDiscussion, updateDiscussion, deleteDiscussion, likeDiscussion, replyToDiscussion, updateDiscussionReply, deleteDiscussionReply, getStudyGroups, getStudyGroup, createStudyGroup, joinStudyGroup, leaveStudyGroup, removeGroupMember, updateStudyGroup, deleteStudyGroup, getGroupMessages, sendGroupMessage, getGroupPosts, createGroupPost, deleteGroupPost, likeGroupPost, replyToGroupPost, getAchievements, getUserAchievements, awardAchievement, createAchievement, updateAchievement, deleteAchievement, getAchievement, awardAchievementToUser, getCommunityStats } from "../controllers/communityController.js";
import { protect, authorize } from "../middleware/auth.js";
const router = express.Router();

// Validation middleware
const validateDiscussion = [body("title").trim().isLength({
  min: 5,
  max: 200
}).withMessage("Title must be between 5 and 200 characters"), body("content").trim().isLength({
  min: 10,
  max: 5000
}).withMessage("Content must be between 10 and 5000 characters"), body("category").optional().isIn(["general", "mathematics", "science", "english", "social-science"]).withMessage("Invalid category"), body("tags").optional().isArray({
  max: 5
}).withMessage("Tags must be an array with maximum 5 items"), body("tags.*").optional().isString().isLength({
  min: 1,
  max: 20
}).withMessage("Each tag must be between 1 and 20 characters")];
const validateReply = [body("content").trim().isLength({
  min: 1,
  max: 1000
}).withMessage("Reply must be between 1 and 1000 characters")];
const validateDiscussionUpdate = [body("title").optional().trim().isLength({
  min: 5,
  max: 200
}).withMessage("Title must be between 5 and 200 characters"), body("content").optional().trim().isLength({
  min: 10,
  max: 5000
}).withMessage("Content must be between 10 and 5000 characters"), body("category").optional().isIn(["general", "mathematics", "science", "english", "social-science"]).withMessage("Invalid category"), body("tags").optional().isArray({
  max: 5
}).withMessage("Tags must be an array with maximum 5 items"), body("tags.*").optional().isString().isLength({
  min: 1,
  max: 20
}).withMessage("Each tag must be between 1 and 20 characters")];
const validateStudyGroup = [body("name").trim().isLength({
  min: 3,
  max: 100
}).withMessage("Group name must be between 3 and 100 characters"), body("description").trim().isLength({
  min: 10,
  max: 1000
}).withMessage("Description must be between 10 and 1000 characters"), body("subject").isIn(["mathematics", "science", "english", "social-science", "computer-science", "art-craft"]).withMessage("Invalid subject"), body("maxMembers").optional().isInt({
  min: 2,
  max: 50
}).withMessage("Maximum members must be between 2 and 50")];
const validateStudyGroupUpdate = [body("name").optional().trim().isLength({
  min: 3,
  max: 100
}).withMessage("Group name must be between 3 and 100 characters"), body("description").optional().trim().isLength({
  min: 10,
  max: 1000
}).withMessage("Description must be between 10 and 1000 characters"), body("subject").optional().isIn(["mathematics", "science", "english", "social-science", "computer-science", "art-craft"]).withMessage("Invalid subject"), body("maxMembers").optional().isInt({
  min: 2,
  max: 50
}).withMessage("Maximum members must be between 2 and 50"), body("tags").optional().isArray({
  max: 8
}).withMessage("Tags must be an array with maximum 8 items"), body("tags.*").optional().isString().isLength({
  min: 1,
  max: 20
}).withMessage("Each tag must be between 1 and 20 characters")];

// Public routes
router.get("/discussions", getDiscussions);
router.get("/groups", getStudyGroups);
router.get("/achievements", getAchievements);
router.get("/stats", getCommunityStats);

// Protected routes
router.use(protect);

// Discussion routes
router.post("/discussions", validateDiscussion, createDiscussion);
router.put("/discussions/:id", validateDiscussionUpdate, updateDiscussion);
router.delete("/discussions/:id", deleteDiscussion);
router.post("/discussions/:id/like", likeDiscussion);
router.post("/discussions/:id/replies", validateReply, replyToDiscussion);
router.put("/discussions/:id/replies/:replyId", validateReply, updateDiscussionReply);
router.delete("/discussions/:id/replies/:replyId", deleteDiscussionReply);

// Study group routes
router.get("/groups/:id", getStudyGroup);
router.post("/groups", validateStudyGroup, createStudyGroup);
router.post("/groups/:id/join", joinStudyGroup);
router.post("/groups/:id/leave", leaveStudyGroup);
router.delete("/groups/:id/members/:userId", removeGroupMember);
router.put("/groups/:id", validateStudyGroupUpdate, updateStudyGroup);
router.delete("/groups/:id", deleteStudyGroup);

// Group messages
router.get("/groups/:id/messages", getGroupMessages);
router.post("/groups/:id/messages", sendGroupMessage);

// Group posts
router.get("/groups/:id/posts", getGroupPosts);
router.post("/groups/:id/posts", createGroupPost);
router.delete("/groups/:id/posts/:postId", deleteGroupPost);
router.post("/groups/:id/posts/:postId/like", likeGroupPost);
router.post("/groups/:id/posts/:postId/replies", replyToGroupPost);

// Achievement routes
router.get("/achievements/user", getUserAchievements);
router.post("/achievements/:id/award", awardAchievement);

// Admin achievement management
router.post("/achievements", protect, authorize("admin"), createAchievement);
router.put("/achievements/:id", protect, authorize("admin"), updateAchievement);
router.delete("/achievements/:id", protect, authorize("admin"), deleteAchievement);
router.get("/achievements/:id", protect, authorize("admin"), getAchievement);
router.post("/achievements/:id/award-user/:userId", protect, authorize("admin"), awardAchievementToUser);
export default router;
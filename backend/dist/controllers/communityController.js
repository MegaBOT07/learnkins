import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Community from '../models/Community.js';
import StudyGroup from '../models/StudyGroup.js';
import Achievement from '../models/Achievement.js';
import { checkAndAwardAchievements } from '../utils/achievementChecker.js';
const canManage = (reqUser, ownerId) => {
  if (!reqUser) return false;
  if (reqUser.role === 'admin') return true;
  return String(reqUser.id) === String(ownerId);
};

// @desc    Get discussions
// @route   GET /api/community/discussions
// @access  Public
export const getDiscussions = async (req, res) => {
  try {
    const {
      limit = 20,
      page = 1,
      category,
      search
    } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search) {
      query.$or = [{
        title: {
          $regex: search,
          $options: 'i'
        }
      }, {
        content: {
          $regex: search,
          $options: 'i'
        }
      }];
    }
    const discussions = await Community.find(query).populate('author', 'name avatar').populate('replyItems.author', 'name avatar').sort({
      createdAt: -1
    }).skip(skip).limit(parseInt(limit));
    const mappedDiscussions = discussions.map(discussion => {
      const likedBy = (discussion.likedBy || []).map(id => String(id));
      const isLiked = Boolean(req.user?.id) && likedBy.includes(String(req.user.id));
      return {
        ...discussion.toObject(),
        isLiked
      };
    });
    const total = await Community.countDocuments(query);
    res.status(200).json({
      success: true,
      discussions: mappedDiscussions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get discussions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching discussions'
    });
  }
};

// @desc    Create discussion
// @route   POST /api/community/discussions
// @access  Private
export const createDiscussion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const {
      title,
      content,
      category,
      tags
    } = req.body;
    const authorId = req.user.id;
    const discussion = await Community.create({
      title,
      content,
      category: category || 'general',
      tags: tags || [],
      author: authorId,
      likes: 0,
      replies: 0
    });
    await discussion.populate('author', 'name avatar');

    // Update user's community post count
    const user = await User.findByIdAndUpdate(authorId, {
      $inc: {
        communityPosts: 1
      }
    }, {
      new: true
    });

    // Check achievements
    if (user) {
      const newAchievements = await checkAndAwardAchievements(authorId);
      if (newAchievements.length > 0) {
        discussion.newAchievements = newAchievements;
      }
    }
    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      discussion
    });
  } catch (error) {
    console.error('Create discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating discussion'
    });
  }
};

// @desc    Like discussion
// @route   POST /api/community/discussions/:id/like
// @access  Private
export const likeDiscussion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const userId = req.user.id;
    const discussion = await Community.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    const alreadyLiked = (discussion.likedBy || []).some(id => String(id) === String(userId));
    if (!discussion.likedBy) discussion.likedBy = [];
    if (alreadyLiked) {
      discussion.likedBy = discussion.likedBy.filter(id => String(id) !== String(userId));
      discussion.likes = Math.max((discussion.likes || 0) - 1, 0);
    } else {
      discussion.likedBy.push(userId);
      discussion.likes += 1;
    }
    await discussion.save();
    res.status(200).json({
      success: true,
      message: alreadyLiked ? 'Discussion unliked successfully' : 'Discussion liked successfully',
      likes: discussion.likes,
      isLiked: !alreadyLiked
    });
  } catch (error) {
    console.error('Like discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while liking discussion'
    });
  }
};

// @desc    Update discussion
// @route   PUT /api/community/discussions/:id
// @access  Private
export const updateDiscussion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const {
      id
    } = req.params;
    const {
      title,
      content,
      category,
      tags
    } = req.body;
    const discussion = await Community.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    if (!canManage(req.user, discussion.author)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this discussion'
      });
    }
    discussion.title = title ?? discussion.title;
    discussion.content = content ?? discussion.content;
    discussion.category = category ?? discussion.category;
    if (Array.isArray(tags)) {
      discussion.tags = tags;
    }
    await discussion.save();
    await discussion.populate('author', 'name avatar');
    await discussion.populate('replyItems.author', 'name avatar');
    res.status(200).json({
      success: true,
      message: 'Discussion updated successfully',
      discussion
    });
  } catch (error) {
    console.error('Update discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating discussion'
    });
  }
};

// @desc    Delete discussion
// @route   DELETE /api/community/discussions/:id
// @access  Private
export const deleteDiscussion = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const discussion = await Community.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    if (!canManage(req.user, discussion.author)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this discussion'
      });
    }
    await discussion.deleteOne();
    if (req.user.role !== 'admin') {
      await User.findByIdAndUpdate(req.user.id, {
        $inc: {
          communityPosts: -1
        }
      });
    }
    res.status(200).json({
      success: true,
      message: 'Discussion deleted successfully'
    });
  } catch (error) {
    console.error('Delete discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting discussion'
    });
  }
};

// @desc    Reply to discussion
// @route   POST /api/community/discussions/:id/replies
// @access  Private
export const replyToDiscussion = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const {
      id
    } = req.params;
    const userId = req.user.id;
    const {
      content
    } = req.body;
    const discussion = await Community.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    if (!discussion.replyItems) discussion.replyItems = [];
    discussion.replyItems.push({
      content,
      author: userId,
      createdAt: new Date()
    });
    discussion.replies = discussion.replyItems.length;
    await discussion.save();
    await discussion.populate('replyItems.author', 'name avatar');
    const newReply = discussion.replyItems[discussion.replyItems.length - 1];
    res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      reply: newReply,
      replies: discussion.replies
    });
  } catch (error) {
    console.error('Reply discussion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while replying to discussion'
    });
  }
};

// @desc    Update reply
// @route   PUT /api/community/discussions/:id/replies/:replyId
// @access  Private
export const updateDiscussionReply = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const {
      id,
      replyId
    } = req.params;
    const {
      content
    } = req.body;
    const discussion = await Community.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    const reply = (discussion.replyItems || []).id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    if (!canManage(req.user, reply.author)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this reply'
      });
    }
    reply.content = content;
    await discussion.save();
    await discussion.populate('replyItems.author', 'name avatar');
    const updatedReply = discussion.replyItems.id(replyId);
    res.status(200).json({
      success: true,
      message: 'Reply updated successfully',
      reply: updatedReply
    });
  } catch (error) {
    console.error('Update reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating reply'
    });
  }
};

// @desc    Delete reply
// @route   DELETE /api/community/discussions/:id/replies/:replyId
// @access  Private
export const deleteDiscussionReply = async (req, res) => {
  try {
    const {
      id,
      replyId
    } = req.params;
    const discussion = await Community.findById(id);
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      });
    }
    const reply = (discussion.replyItems || []).id(replyId);
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: 'Reply not found'
      });
    }
    if (!canManage(req.user, reply.author)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this reply'
      });
    }
    reply.deleteOne();
    discussion.replies = discussion.replyItems.length;
    await discussion.save();
    res.status(200).json({
      success: true,
      message: 'Reply deleted successfully',
      replies: discussion.replies
    });
  } catch (error) {
    console.error('Delete reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting reply'
    });
  }
};

// @desc    Get study groups
// @route   GET /api/community/groups
// @access  Public
export const getStudyGroups = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 1,
      subject,
      search
    } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    if (search) {
      query.$or = [{
        name: {
          $regex: search,
          $options: 'i'
        }
      }, {
        description: {
          $regex: search,
          $options: 'i'
        }
      }];
    }
    const groups = await StudyGroup.find(query).populate('creator', 'name avatar').sort({
      createdAt: -1
    }).skip(skip).limit(parseInt(limit));
    const total = await StudyGroup.countDocuments(query);
    res.status(200).json({
      success: true,
      groups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get study groups error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching study groups'
    });
  }
};

// @desc    Create study group
// @route   POST /api/community/groups
// @access  Private
export const createStudyGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const {
      name,
      description,
      subject,
      maxMembers
    } = req.body;
    const creatorId = req.user.id;
    const group = await StudyGroup.create({
      name,
      description,
      subject,
      maxMembers: maxMembers || 10,
      creator: creatorId,
      members: [creatorId],
      memberCount: 1
    });
    await group.populate('creator', 'name avatar');
    res.status(201).json({
      success: true,
      message: 'Study group created successfully',
      group
    });
  } catch (error) {
    console.error('Create study group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating study group'
    });
  }
};

// @desc    Join study group
// @route   POST /api/community/groups/:id/join
// @access  Private
export const joinStudyGroup = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const userId = req.user.id;
    const group = await StudyGroup.findById(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found'
      });
    }

    // Check if user is already a member
    if (group.members?.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this group'
      });
    }

    // Check if group is full
    if (group.memberCount >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Study group is full'
      });
    }
    group.members.push(userId);
    group.memberCount += 1;
    await group.save();
    res.status(200).json({
      success: true,
      message: 'Joined study group successfully',
      memberCount: group.memberCount
    });
  } catch (error) {
    console.error('Join study group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining study group'
    });
  }
};

// @desc    Update study group
// @route   PUT /api/community/groups/:id
// @access  Private
export const updateStudyGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    const {
      id
    } = req.params;
    const {
      name,
      description,
      subject,
      maxMembers,
      tags
    } = req.body;
    const group = await StudyGroup.findById(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found'
      });
    }
    if (!canManage(req.user, group.creator)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this study group'
      });
    }
    group.name = name ?? group.name;
    group.description = description ?? group.description;
    group.subject = subject ?? group.subject;
    if (typeof maxMembers !== 'undefined') {
      group.maxMembers = maxMembers;
    }
    if (Array.isArray(tags)) {
      group.tags = tags;
    }
    if (group.memberCount > group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Max members cannot be less than current member count'
      });
    }
    await group.save();
    await group.populate('creator', 'name avatar');
    res.status(200).json({
      success: true,
      message: 'Study group updated successfully',
      group
    });
  } catch (error) {
    console.error('Update study group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating study group'
    });
  }
};

// @desc    Delete study group
// @route   DELETE /api/community/groups/:id
// @access  Private
export const deleteStudyGroup = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const group = await StudyGroup.findById(id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Study group not found'
      });
    }
    if (!canManage(req.user, group.creator)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this study group'
      });
    }
    await group.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Study group deleted successfully'
    });
  } catch (error) {
    console.error('Delete study group error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting study group'
    });
  }
};

// @desc    Get achievements
// @route   GET /api/community/achievements
// @access  Public
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      points: -1
    });
    res.status(200).json({
      success: true,
      achievements
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching achievements'
    });
  }
};

// @desc    Get user achievements
// @route   GET /api/community/achievements/user
// @access  Private
export const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('achievements');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      achievements: user.achievements || []
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user achievements'
    });
  }
};

// @desc    Award achievement to user
// @route   POST /api/community/achievements/:id/award
// @access  Private
export const awardAchievement = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const userId = req.user.id;
    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has this achievement
    if (user.achievements?.includes(id)) {
      return res.status(400).json({
        success: false,
        message: 'User already has this achievement'
      });
    }

    // Add achievement to user
    if (!user.achievements) user.achievements = [];
    user.achievements.push(id);
    user.points = (user.points || 0) + achievement.points;
    await user.save();
    res.status(200).json({
      success: true,
      message: 'Achievement awarded successfully',
      achievement,
      userPoints: user.points
    });
  } catch (error) {
    console.error('Award achievement error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while awarding achievement'
    });
  }
};

// @desc    Get community stats
// @route   GET /api/community/stats
// @access  Public
export const getCommunityStats = async (req, res) => {
  try {
    const [totalDiscussions, totalGroups, totalUsers, topAchievements] = await Promise.all([Community.countDocuments(), StudyGroup.countDocuments(), User.countDocuments(), Achievement.find().sort({
      points: -1
    }).limit(5)]);
    res.status(200).json({
      success: true,
      stats: {
        totalDiscussions,
        totalGroups,
        totalUsers,
        topAchievements
      }
    });
  } catch (error) {
    console.error('Get community stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching community stats'
    });
  }
};
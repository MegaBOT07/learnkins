import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import ParentalControl from '../models/ParentalControl.js';

// @desc    Get all children for a parent
// @route   GET /api/parental/children
// @access  Private (Parent only)
export const getChildren = async (req, res) => {
  try {
    const parentId = req.user.id;

    const children = await User.find({ parentId }).select('-password');

    if (!children || children.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No children found',
        children: []
      });
    }

    // Get progress for each child
    const childrenWithProgress = await Promise.all(
      children.map(async (child) => {
        const progress = await Progress.findOne({ userId: child._id });
        return {
          id: child._id,
          name: child.name,
          age: child.age || 0,
          grade: child.grade || 'N/A',
          avatar: child.avatar || '👤',
          status: 'online',
          lastActive: child.lastActive || 'Recently',
          totalStudyTime: progress?.totalStudyTime || 0,
          weeklyGoal: progress?.weeklyGoal || 20,
          currentStreak: progress?.currentStreak || 0,
          achievements: progress?.achievements?.length || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      children: childrenWithProgress
    });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching children'
    });
  }
};

// @desc    Get parental controls for a child
// @route   GET /api/parental/:childId
// @access  Private (Parent only)
export const getControls = async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user.id;

    // Verify parent-child relationship
    const child = await User.findById(childId);
    if (!child || child.parentId?.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view controls for your own children.'
      });
    }

    let controls = await ParentalControl.findOne({ childId });
    
    if (!controls) {
      // Create default controls
      controls = await ParentalControl.create({
        childId,
        parentId,
        timeControls: {
          // store minutes internally
          dailyLimit: 3 * 60,
          breakReminder: 30,
          bedtimeRestriction: '21:00',
          weekendBonus: 1 * 60
        },
        contentFilters: {
          // use subject slugs that match schema enums
          allowedSubjects: ['science', 'mathematics', 'social-science', 'english'],
          communityAccess: true,
          // store gaming time in minutes to match schema (default 60 minutes)
          gamingTimeLimit: 1 * 60
        }
      });
    }

    res.status(200).json({
      success: true,
      controls
    });
  } catch (error) {
    console.error('Get controls error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching controls'
    });
  }
};

// @desc    Update time controls
// @route   PUT /api/parental/:childId/time-controls
// @access  Private (Parent only)
export const setTimeControls = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { childId } = req.params;
    const parentId = req.user.id;
    const { dailyLimit, breakReminder, bedtimeRestriction, weekendBonus } = req.body;

    // Verify parent-child relationship
    const child = await User.findById(childId);
    if (!child || child.parentId?.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update controls for your own children.'
      });
    }

    let controls = await ParentalControl.findOne({ childId });
    
    if (!controls) {
      controls = new ParentalControl({ childId, parentId });
    }

    // Convert incoming hour-based values to minutes where appropriate
    controls.timeControls = {
      dailyLimit: dailyLimit ? Number(dailyLimit) * 60 : controls.timeControls?.dailyLimit || 3 * 60,
      breakReminder: breakReminder ? Number(breakReminder) : controls.timeControls?.breakReminder || 30,
      bedtimeRestriction: bedtimeRestriction || controls.timeControls?.bedtimeRestriction || '21:00',
      weekendBonus: weekendBonus ? Number(weekendBonus) * 60 : controls.timeControls?.weekendBonus || 1 * 60,
      allowedDays: controls.timeControls?.allowedDays || []
    };

    await controls.save();

    res.status(200).json({
      success: true,
      message: 'Time controls updated successfully',
      controls: controls.timeControls
    });
  } catch (error) {
    console.error('Set time controls error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating time controls'
    });
  }
};

// @desc    Update content filters
// @route   PUT /api/parental/:childId/content-filters
// @access  Private (Parent only)
export const setContentFilters = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { childId } = req.params;
    const parentId = req.user.id;
    const { allowedSubjects, communityAccess, gamingTime } = req.body;

    // Verify parent-child relationship
    const child = await User.findById(childId);
    if (!child || child.parentId?.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update controls for your own children.'
      });
    }

    let controls = await ParentalControl.findOne({ childId });
    
    if (!controls) {
      controls = new ParentalControl({ childId, parentId });
    }

    // Normalize allowedSubjects to schema-friendly slugs and convert gaming time to minutes
    const normalizeSubjects = (arr) => {
      if (!Array.isArray(arr)) return ['science', 'mathematics', 'social-science', 'english'];
      return arr
        .map((s) => String(s || '').toLowerCase().trim().replace(/\s+/g, '-'))
        .filter(Boolean);
    };

    controls.contentFilters = {
      allowedSubjects: allowedSubjects ? normalizeSubjects(allowedSubjects) : controls.contentFilters?.allowedSubjects || ['science', 'mathematics', 'social-science', 'english'],
      communityAccess: communityAccess !== undefined ? Boolean(communityAccess) : (controls.contentFilters?.communityAccess ?? true),
      gamingTimeLimit: gamingTime ? Number(gamingTime) * 60 : controls.contentFilters?.gamingTimeLimit || 60,
      blockedContent: controls.contentFilters?.blockedContent || []
    };

    await controls.save();

    res.status(200).json({
      success: true,
      message: 'Content filters updated successfully',
      filters: controls.contentFilters
    });
  } catch (error) {
    console.error('Set content filters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating content filters'
    });
  }
};

// @desc    Get child progress
// @route   GET /api/parental/:childId/progress
// @access  Private (Parent only)
export const getChildProgress = async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user.id;

    // Verify parent-child relationship
    const child = await User.findById(childId);
    if (!child || child.parentId?.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view progress for your own children.'
      });
    }

    // Get current week's progress
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const currentProgress = await Progress.aggregate([
      {
        $match: {
          userId: childId,
          date: { $gte: startOfWeek, $lt: endOfWeek }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$studyHours' },
          lessonsCompleted: { $sum: '$lessonsCompleted' },
          quizzesTaken: { $sum: '$quizzesTaken' },
          averageScore: { $avg: '$averageScore' }
        }
      }
    ]);

    // Get previous week's progress for comparison
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);

    const previousProgress = await Progress.aggregate([
      {
        $match: {
          userId: childId,
          date: { $gte: startOfLastWeek, $lt: endOfLastWeek }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$studyHours' },
          lessonsCompleted: { $sum: '$lessonsCompleted' },
          quizzesTaken: { $sum: '$quizzesTaken' },
          averageScore: { $avg: '$averageScore' }
        }
      }
    ]);

    const current = currentProgress[0] || {
      totalHours: 0,
      lessonsCompleted: 0,
      quizzesTaken: 0,
      averageScore: 0
    };

    const previous = previousProgress[0] || {
      totalHours: 0,
      lessonsCompleted: 0,
      quizzesTaken: 0,
      averageScore: 0
    };

    res.status(200).json({
      success: true,
      current,
      previous
    });
  } catch (error) {
    console.error('Get child progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching child progress'
    });
  }
};

// @desc    Get child activity
// @route   GET /api/parental/:childId/activity
// @access  Private (Parent only)
export const getChildActivity = async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user.id;

    // Verify parent-child relationship
    const child = await User.findById(childId);
    if (!child || child.parentId?.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view activity for your own children.'
      });
    }

    // Get recent activities (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activities = await Progress.find({
      userId: childId,
      date: { $gte: thirtyDaysAgo }
    })
    .sort({ date: -1 })
    .limit(50);

    // Calculate streaks and other metrics
    const currentStreak = await calculateStreak(childId);
    const totalHours = activities.reduce((sum, activity) => sum + activity.studyHours, 0);
    const averageScore = activities.length > 0 
      ? activities.reduce((sum, activity) => sum + activity.averageScore, 0) / activities.length 
      : 0;

    res.status(200).json({
      success: true,
      activities,
      metrics: {
        currentStreak,
        totalHours,
        averageScore: Math.round(averageScore * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get child activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching child activity'
    });
  }
};

// @desc    Get session logs
// @route   GET /api/parental/:childId/session-logs
// @access  Private (Parent only)
export const getSessionLogs = async (req, res) => {
  try {
    const { childId } = req.params;
    const parentId = req.user.id;

    // Verify parent-child relationship
    const child = await User.findById(childId);
    if (!child || child.parentId?.toString() !== parentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view session logs for your own children.'
      });
    }

    const logs = await Progress.find({ userId: childId })
      .sort({ date: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      logs
    });
  } catch (error) {
    console.error('Get session logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session logs'
    });
  }
};

// Helper function to calculate streak
const calculateStreak = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const activity = await Progress.findOne({
        userId,
        date: {
          $gte: currentDate,
          $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (activity && activity.studyHours > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Calculate streak error:', error);
    return 0;
  }
};
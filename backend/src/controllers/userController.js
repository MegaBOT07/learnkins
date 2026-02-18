import mongoose from 'mongoose';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import Achievement from '../models/Achievement.js';
import TokenTransaction from '../models/TokenTransaction.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, grade } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (grade) filter.grade = grade;

    const users = await User.find(filter)
      .select('-password')
      .populate('children', 'name email grade')
      .populate('parentId', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(id)
      .select('-password')
      .populate('children', 'name email grade')
      .populate('parentId', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, grade, preferences } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        grade,
        preferences
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user progress
// @route   GET /api/users/:id/progress
// @access  Private
export const getUserProgress = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const progress = await Progress.find({ userId: id })
      .sort({ lastAccessed: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user achievements
// @route   GET /api/users/:id/achievements
// @access  Private
export const getUserAchievements = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const achievements = await Achievement.find({
      'earnedBy.user': id
    });

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cleanup all students
// @route   POST /api/users/cleanup-students
// @access  Private (Admin)
export const cleanupStudents = async (req, res) => {
  try {
    // 1. Find all students
    const students = await User.find({ role: 'student' });
    const studentIds = students.map(s => s._id);

    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No students found to clean up'
      });
    }

    console.log(`Cleaning up ${students.length} students...`);

    // 2. Remove students from parent children arrays
    await User.updateMany(
      { role: 'parent' },
      { $pull: { children: { $in: studentIds } } }
    );

    // 3. Delete progress records
    await Progress.deleteMany({ userId: { $in: studentIds } });

    // 4. Delete token transactions
    await TokenTransaction.deleteMany({ userId: { $in: studentIds } });

    // 5. Hard delete student users
    const result = await User.deleteMany({ role: 'student' });

    res.status(200).json({
      success: true,
      message: `Successfully removed ${result.deletedCount} students and associated records`,
      count: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during cleanup'
    });
  }
};
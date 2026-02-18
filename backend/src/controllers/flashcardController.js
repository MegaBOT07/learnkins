import Flashcard from '../models/Flashcard.js';
import Progress from '../models/Progress.js';

// @desc    Get all flashcards
// @route   GET /api/flashcards
// @access  Public
export const getFlashcards = async (req, res) => {
  try {
    const { 
      subject, 
      difficulty, 
      search, 
      page = 1, 
      limit = 12,
      sortBy = 'recent' 
    } = req.query;
    
    let filter = { isPublic: true, isActive: true };
    
    // Treat literal 'undefined' or 'null' query values as absent (frontend sometimes sends them)
    if (subject && subject !== 'all' && subject !== 'undefined' && subject !== 'null') {
      filter.subject = subject;
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    let query = Flashcard.find(filter).populate('createdBy', 'name');

    // Search functionality
    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    // Sorting
    switch (sortBy) {
      case 'popular':
        query = query.sort({ studyCount: -1, 'rating.average': -1 });
        break;
      case 'rating':
        query = query.sort({ 'rating.average': -1, studyCount: -1 });
        break;
      case 'recent':
      default:
        query = query.sort({ createdAt: -1 });
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    const flashcards = await query;
    const total = await Flashcard.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: flashcards.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: flashcards
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single flashcard
// @route   GET /api/flashcards/:id
// @access  Public
export const getFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flashcard
    });
  } catch (error) {
    console.error('Get flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create flashcard
// @route   POST /api/flashcards
// @access  Private
export const createFlashcard = async (req, res) => {
  try {
    const { question, answer, subject, chapter, difficulty, tags, isPublic } = req.body;

    const flashcard = await Flashcard.create({
      question,
      answer,
      subject,
      chapter,
      difficulty,
      tags: Array.isArray(tags) ? tags.map(t => typeof t === 'string' ? t.trim().toLowerCase() : t) : (tags ? tags.split(',').map(tag => tag.trim().toLowerCase()) : []),
      isPublic: isPublic !== undefined ? isPublic : true,
      createdBy: req.user.id
    });

    await flashcard.populate('createdBy', 'name');

    res.status(201).json({
      success: true,
      message: 'Flashcard created successfully',
      data: flashcard
    });
  } catch (error) {
    console.error('Create flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update flashcard
// @route   PUT /api/flashcards/:id
// @access  Private
export const updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // Check if user is the creator or admin
    if (flashcard.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this flashcard'
      });
    }

    const { question, answer, subject, chapter, difficulty, tags, isPublic } = req.body;

    flashcard.question = question || flashcard.question;
    flashcard.answer = answer || flashcard.answer;
    flashcard.subject = subject || flashcard.subject;
    flashcard.chapter = chapter || flashcard.chapter;
    flashcard.difficulty = difficulty || flashcard.difficulty;
    flashcard.isPublic = isPublic !== undefined ? isPublic : flashcard.isPublic;
    
    if (tags) {
      flashcard.tags = tags.split(',').map(tag => tag.trim().toLowerCase());
    }

    await flashcard.save();
    await flashcard.populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      message: 'Flashcard updated successfully',
      data: flashcard
    });
  } catch (error) {
    console.error('Update flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
export const deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // Check if user is the creator or admin
    if (flashcard.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this flashcard'
      });
    }

    // Soft delete
    flashcard.isActive = false;
    await flashcard.save();

    res.status(200).json({
      success: true,
      message: 'Flashcard deleted successfully'
    });
  } catch (error) {
    console.error('Delete flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Study flashcard
// @route   POST /api/flashcards/:id/study
// @access  Private
export const studyFlashcard = async (req, res) => {
  try {
    const { difficulty } = req.body; // User's perceived difficulty
    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // Increment study count
    await flashcard.incrementStudyCount(req.user.id);

    // Update progress
    await Progress.findOneAndUpdate(
      { userId: req.user.id, subject: flashcard.subject },
      {
        $push: {
          completedActivities: {
            type: 'flashcard',
            activityId: flashcard._id,
            score: difficulty === 'easy' ? 100 : difficulty === 'medium' ? 75 : 50
          }
        },
        lastAccessed: new Date()
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Study session recorded',
      data: {
        studyCount: flashcard.studyCount + 1
      }
    });
  } catch (error) {
    console.error('Study flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Rate flashcard
// @route   POST /api/flashcards/:id/rate
// @access  Private
export const rateFlashcard = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const flashcard = await Flashcard.findById(req.params.id);

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    await flashcard.addRating(req.user.id, rating);

    res.status(200).json({
      success: true,
      message: 'Rating added successfully',
      data: {
        averageRating: flashcard.rating.average,
        totalRatings: flashcard.rating.count
      }
    });
  } catch (error) {
    console.error('Rate flashcard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's flashcards
// @route   GET /api/flashcards/my
// @access  Private
export const getMyFlashcards = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    
    const flashcards = await Flashcard.find({ 
      createdBy: req.user.id, 
      isActive: true 
    })
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Flashcard.countDocuments({ 
      createdBy: req.user.id, 
      isActive: true 
    });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      total,
      data: flashcards
    });
  } catch (error) {
    console.error('Get my flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get popular flashcards
// @route   GET /api/flashcards/popular
// @access  Public
export const getPopularFlashcards = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const flashcards = await Flashcard.getPopular(parseInt(limit));

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards
    });
  } catch (error) {
    console.error('Get popular flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get recent flashcards
// @route   GET /api/flashcards/recent
// @access  Public
export const getRecentFlashcards = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const flashcards = await Flashcard.getRecent(parseInt(limit));

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards
    });
  } catch (error) {
    console.error('Get recent flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search flashcards
// @route   GET /api/flashcards/search
// @access  Public
export const searchFlashcards = async (req, res) => {
  try {
    const { q, subject, difficulty, limit = 20 } = req.query;

    let filter = { isPublic: true, isActive: true };
    
    // Treat literal 'undefined' or 'null' query values as absent
    if (subject && subject !== 'all' && subject !== 'undefined' && subject !== 'null') {
      filter.subject = subject;
    }
    
    if (difficulty && difficulty !== 'all') {
      filter.difficulty = difficulty;
    }

    let query = Flashcard.find(filter).populate('createdBy', 'name');

    if (q) {
      query = query.find({ $text: { $search: q } });
    }

    const flashcards = await query
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards
    });
  } catch (error) {
    console.error('Search flashcards error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
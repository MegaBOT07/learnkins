import Subject from '../models/Subject.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
export const getSubjects = async (req, res) => {
  try {
    const { grade } = req.query;
    
    let filter = { isActive: true };
    if (grade) {
      filter.grade = grade;
    }

    const subjects = await Subject.find(filter).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:slug
// @access  Public
export const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Admin/Teacher)
export const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin/Teacher)
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Update subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin/Teacher)
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Soft delete
    subject.isActive = false;
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get subject chapters
// @route   GET /api/subjects/:slug/chapters
// @access  Public
export const getSubjectChapters = async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const chapters = subject.chapters.sort((a, b) => a.order - b.order);

    res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add chapter to subject
// @route   POST /api/subjects/:subjectId/chapters
// @access  Private (Admin/Teacher)
export const addChapter = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    subject.chapters.push(req.body);
    await subject.save();

    res.status(201).json({
      success: true,
      message: 'Chapter added successfully',
      data: subject
    });
  } catch (error) {
    console.error('Add chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update chapter
// @route   PUT /api/subjects/:subjectId/chapters/:chapterId
// @access  Private (Admin/Teacher)
export const updateChapter = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    const chapter = subject.chapters.id(req.params.chapterId);
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    Object.assign(chapter, req.body);
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Chapter updated successfully',
      data: subject
    });
  } catch (error) {
    console.error('Update chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete chapter
// @route   DELETE /api/subjects/:subjectId/chapters/:chapterId
// @access  Private (Admin/Teacher)
export const deleteChapter = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    subject.chapters.id(req.params.chapterId).remove();
    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Chapter deleted successfully'
    });
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
import Material from '../models/Material.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all materials
// @route   GET /api/materials
// @access  Public
export const getMaterials = async (req, res) => {
  try {
    const { subject, type, grade, page = 1, limit = 10 } = req.query;
    
    let filter = { isPublic: true };
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (grade) filter.grade = grade;

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Material.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: materials.length,
      total,
      data: materials
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Public
export const getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name');

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create material
// @route   POST /api/materials
// @access  Private (Admin/Teacher)
export const createMaterial = async (req, res) => {
  try {
    const { title, description, type, subject, chapter, grade, tags, difficulty } = req.body;

    let fileUrl = '';
    let thumbnailUrl = '';

    if (req.file) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'brillix/materials',
        resource_type: 'auto'
      });
      
      fileUrl = result.secure_url;
      
      // Generate thumbnail for videos
      if (type === 'video') {
        const thumbnailResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'brillix/thumbnails',
          transformation: [
            { width: 300, height: 200, crop: 'fill' },
            { quality: 'auto' }
          ]
        });
        thumbnailUrl = thumbnailResult.secure_url;
      }
    }

    const material = await Material.create({
      title,
      description,
      type,
      subject,
      chapter,
      grade,
      fileUrl,
      thumbnailUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      difficulty,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Material created successfully',
      data: material
    });
  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private (Admin/Teacher)
export const updateMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Material updated successfully',
      data: material
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private (Admin/Teacher)
export const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    await material.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Download material
// @route   GET /api/materials/:id/download
// @access  Public
export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Increment download count
    await material.incrementDownload();

    res.status(200).json({
      success: true,
      data: {
        downloadUrl: material.fileUrl,
        filename: material.title
      }
    });
  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Search materials
// @route   GET /api/materials/search
// @access  Public
export const searchMaterials = async (req, res) => {
  try {
    const { q, subject, type, grade } = req.query;

    let filter = { isPublic: true };
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (grade) filter.grade = grade;

    if (q) {
      filter.$text = { $search: q };
    }

    const materials = await Material.find(filter)
      .populate('uploadedBy', 'name')
      .sort({ score: { $meta: 'textScore' } })
      .limit(20);

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Search materials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
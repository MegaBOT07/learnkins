import path from 'path';
import fs from 'fs';
import Material from '../models/Material.js';
const MIME_TYPES = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};
const UPLOADS_DIR = path.resolve('uploads');

// @desc    Get all materials
// @route   GET /api/materials
// @access  Public
export const getMaterials = async (req, res) => {
  try {
    const {
      subject,
      type,
      grade,
      page = 1,
      limit = 10
    } = req.query;
    let filter = {
      isPublic: true
    };
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (grade) filter.grade = grade;
    const materials = await Material.find(filter).populate('uploadedBy', 'name').limit(limit * 1).skip((page - 1) * limit).sort({
      createdAt: -1
    });
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
    const material = await Material.findById(req.params.id).populate('uploadedBy', 'name');
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
    const {
      title,
      description,
      type,
      subject,
      chapter,
      grade,
      tags,
      difficulty
    } = req.body;
    let fileUrl = req.body.fileUrl || '';
    let thumbnailUrl = req.body.thumbnailUrl || '';
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
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
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
    if (material.fileUrl && material.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(material.fileUrl));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
    await material.incrementDownload();
    if (material.fileUrl && material.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(material.fileUrl));
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found on server'
        });
      }
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
      const filename = `${material.title}${ext}`;
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      fs.createReadStream(filePath).pipe(res);
    } else if (material.fileUrl) {
      res.redirect(material.fileUrl);
    } else {
      res.status(404).json({
        success: false,
        message: 'No file available'
      });
    }
  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    View material file inline
// @route   GET /api/materials/:id/view
// @access  Public
export const viewMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material || !material.fileUrl) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }
    if (material.fileUrl.startsWith('/uploads/')) {
      const filePath = path.join(UPLOADS_DIR, path.basename(material.fileUrl));
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          success: false,
          message: 'File not found on server'
        });
      }
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
      const isInline = mimeType === 'application/pdf' || mimeType.startsWith('image/');
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', isInline ? 'inline' : 'attachment');
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.redirect(material.fileUrl);
    }
  } catch (error) {
    console.error('View material error:', error);
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
    const {
      q,
      subject,
      type,
      grade
    } = req.query;
    let filter = {
      isPublic: true
    };
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (grade) filter.grade = grade;
    if (q) {
      filter.$text = {
        $search: q
      };
    }
    const materials = await Material.find(filter).populate('uploadedBy', 'name').sort({
      score: {
        $meta: 'textScore'
      }
    }).limit(20);
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
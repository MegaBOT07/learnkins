import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  // No token provided
  return res.status(401).json({
    success: false,
    message: 'Not authorized, no token'
  });
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

export const parentalAuth = async (req, res, next) => {
  try {
    const { childId } = req.params;
    
    if (req.user.role === 'parent') {
      const child = await User.findById(childId);
      if (!child || child.parentId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this child\'s data'
        });
      }
    } else if (req.user.role === 'student') {
      if (req.user._id.toString() !== childId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this data'
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error in parental authorization'
    });
  }
};
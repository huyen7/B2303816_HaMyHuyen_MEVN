const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.substring(7);
    
    try {
      // 🛑 SỬA LỖI TẠI ĐÂY: Thay JWT_SECRET bằng JWT_ACCESS_SECRET
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); // ✅ Đã sửa
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid token. User not found.' });
      }
      req.user = user;
      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired.' });
      }
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Server error during authentication.' });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  
  next();
};

// Check if user is owner or admin
const requireOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  
  const userId = req.params.userId || req.params.id;
  
  if (req.user.role === 'admin' || req.user._id.toString() === userId) {
    return next();
  }
  
  res.status(403).json({ message: 'Access denied. You can only access your own resources.' });
};

module.exports = {
  authenticate,
  requireAdmin,
  requireOwnerOrAdmin
};
const User = require('../models/User');
const BorrowingRequest = require('../models/BorrowingRequest');
const { paginate, getPaginationMeta, buildSearchQuery } = require('../utils/pagination');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);

    let query = {};
    
    // Search functionality
    if (search) {
      const searchQuery = buildSearchQuery(search, ['firstName', 'lastName', 'email']);
      query = { ...query, ...searchQuery };
    }
    
    // Role filter
    if (role) {
      query.role = role;
    }

    const [users, totalUsers] = await Promise.all([
      User.find(query)
        .select('-password -refreshTokens')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(totalUsers, pageNum, limitNum);

    res.json({
      users,
      pagination
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(userId).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's borrowing statistics
    const borrowingStats = await BorrowingRequest.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalRequests: 0,
      pending: 0,
      approved: 0,
      returned: 0,
      overdue: 0,
      rejected: 0
    };

    borrowingStats.forEach(stat => {
      stats[stat._id] = stat.count;
      stats.totalRequests += stat.count;
    });

    res.json({
      user: {
        ...user.toObject(),
        borrowingStats: stats
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    
    // Check if user can update this profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { firstName, lastName, email } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check email uniqueness if changed
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.isEmailVerified = false; // Reset email verification if email changed
    }

    // Update fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be "user" or "admin"' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from demoting themselves
    if (req.user._id.toString() === userId && role === 'user') {
      return res.status(400).json({ message: 'You cannot demote yourself' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has active borrowings
    const activeBorrowings = await BorrowingRequest.countDocuments({
      user: userId,
      status: { $in: ['pending', 'approved', 'overdue'] }
    });

    if (activeBorrowings > 0) {
      return res.status(400).json({ 
        message: `Cannot delete user. They have ${activeBorrowings} active borrowing(s).` 
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

// Get user dashboard data
const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current borrowings
    const currentBorrowings = await BorrowingRequest.find({
      user: userId,
      status: { $in: ['approved', 'overdue'] }
    })
    .populate('book', 'title author coverImageUrl')
    .sort({ dueDate: 1 });

    // Get recent borrowing history
    const recentHistory = await BorrowingRequest.find({
      user: userId,
      status: 'returned'
    })
    .populate('book', 'title author coverImageUrl')
    .sort({ returnDate: -1 })
    .limit(5);

    // Get pending requests
    const pendingRequests = await BorrowingRequest.find({
      user: userId,
      status: 'pending'
    })
    .populate('book', 'title author coverImageUrl')
    .sort({ requestDate: -1 });

    // Calculate statistics
    const stats = await BorrowingRequest.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const borrowingStats = {
      totalBorrowed: 0,
      currentlyBorrowed: 0,
      overdue: 0,
      pending: 0
    };

    stats.forEach(stat => {
      if (stat._id === 'returned') borrowingStats.totalBorrowed += stat.count;
      if (stat._id === 'approved') borrowingStats.currentlyBorrowed += stat.count;
      if (stat._id === 'overdue') borrowingStats.overdue += stat.count;
      if (stat._id === 'pending') borrowingStats.pending += stat.count;
    });

    borrowingStats.totalBorrowed += borrowingStats.currentlyBorrowed + borrowingStats.overdue;

    res.json({
      currentBorrowings,
      recentHistory,
      pendingRequests,
      stats: borrowingStats
    });
  } catch (error) {
    console.error('Get user dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  deleteUser,
  getUserDashboard
};
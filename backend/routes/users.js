const express = require('express');
const router = express.Router();
const { validate, userSchemas } = require('../middleware/validation');
const { authenticate, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserRole,
  deleteUser,
  getUserDashboard
} = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authenticate, requireAdmin, getAllUsers);

// @route   GET /api/users/dashboard
// @desc    Get current user dashboard data
// @access  Private
router.get('/dashboard', authenticate, getUserDashboard);

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticate, (req, res) => {
  req.params.id = req.user._id;
  getUserById(req, res);
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Owner or Admin)
router.get('/:id', authenticate, requireOwnerOrAdmin, getUserById);

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authenticate, validate(userSchemas.updateProfile), updateProfile);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private (Owner or Admin)
router.put('/:id', authenticate, requireOwnerOrAdmin, validate(userSchemas.updateProfile), updateProfile);

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/:id/role', authenticate, requireAdmin, updateUserRole);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, deleteUser);

module.exports = router;
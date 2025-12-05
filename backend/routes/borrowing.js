const express = require('express');
const router = express.Router();
const { validate, borrowingSchemas } = require('../middleware/validation');
const { authenticate, requireAdmin, requireOwnerOrAdmin } = require('../middleware/auth');
const {
  createBorrowingRequest,
  getUserBorrowingRequests,
  getAllBorrowingRequests,
  approveBorrowingRequest,
  rejectBorrowingRequest,
  returnBook
} = require('../controllers/borrowingController');

// @route   POST /api/borrowing/request
// @desc    Create borrowing request
// @access  Private
router.post('/request', authenticate, validate(borrowingSchemas.request), createBorrowingRequest);

// @route   GET /api/borrowing/user/:userId
// @desc    Get user's borrowing requests
// @access  Private (Owner or Admin)
router.get('/user/:userId', authenticate, requireOwnerOrAdmin, getUserBorrowingRequests);

// @route   GET /api/borrowing/user
// @desc    Get current user's borrowing requests
// @access  Private
router.get('/user', authenticate, getUserBorrowingRequests);

// @route   GET /api/borrowing
// @desc    Get all borrowing requests
// @access  Private (Admin only)
router.get('/', authenticate, requireAdmin, getAllBorrowingRequests);

// @route   PUT /api/borrowing/:id/approve
// @desc    Approve borrowing request
// @access  Private (Admin only)
router.put('/:id/approve', authenticate, requireAdmin, validate(borrowingSchemas.approve), approveBorrowingRequest);

// @route   PUT /api/borrowing/:id/reject
// @desc    Reject borrowing request
// @access  Private (Admin only)
router.put('/:id/reject', authenticate, requireAdmin, validate(borrowingSchemas.reject), rejectBorrowingRequest);

// @route   PUT /api/borrowing/:id/return
// @desc    Return book
// @access  Private (Owner or Admin)
router.put('/:id/return', authenticate, returnBook);

module.exports = router;
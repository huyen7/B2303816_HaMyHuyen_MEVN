const express = require('express');
const router = express.Router();
const { validate, bookSchemas } = require('../middleware/validation');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// @route   GET /api/books
// @desc    Get all books with search, filter, and pagination
// @access  Public
router.get('/', getBooks);

// @route   GET /api/books/:id
// @desc    Get single book by ID
// @access  Public
router.get('/:id', getBookById);

// @route   POST /api/books
// @desc    Create new book
// @access  Private (Admin only)
router.post('/', 
  authenticate, 
  requireAdmin, 
  upload.single('coverImage'), 
  handleUploadError,
  validate(bookSchemas.create), 
  createBook
);

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (Admin only)
router.put('/:id', 
  authenticate, 
  requireAdmin, 
  upload.single('coverImage'), 
  handleUploadError,
  validate(bookSchemas.update), 
  updateBook
);

// @route   DELETE /api/books/:id
// @desc    Delete book (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, deleteBook);

module.exports = router;
const express = require('express');
const router = express.Router();
const { validate, categorySchemas } = require('../middleware/validation');
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', getCategories);

// @route   GET /api/categories/:id
// @desc    Get single category by ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   POST /api/categories
// @desc    Create new category
// @access  Private (Admin only)
router.post('/', authenticate, requireAdmin, validate(categorySchemas.create), createCategory);

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private (Admin only)
router.put('/:id', authenticate, requireAdmin, validate(categorySchemas.update), updateCategory);

// @route   DELETE /api/categories/:id
// @desc    Delete category (soft delete)
// @access  Private (Admin only)
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

module.exports = router;
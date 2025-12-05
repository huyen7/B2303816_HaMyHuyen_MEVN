const Category = require('../models/Category');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const { includeInactive = false } = req.query;
    
    let query = {};
    if (!includeInactive) {
      query.isActive = true;
    }
    
    const categories = await Category.find(query).sort({ name: 1 });
    
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ category });
  } catch (error) {
    console.error('Get category error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    res.status(500).json({ message: 'Server error while fetching category' });
  }
};

// Create new category (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }
    
    const category = new Category({
      name,
      description
    });
    
    await category.save();
    
    res.status(201).json({
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error while creating category' });
  }
};

// Update category (Admin only)
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const { name, description, isActive } = req.body;
    
    // Check name uniqueness if changed
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: new RegExp(`^${name}$`, 'i'),
        _id: { $ne: category._id }
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category with this name already exists' });
      }
    }
    
    // Update fields
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    
    await category.save();
    
    res.json({
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error while updating category' });
  }
};

// Delete category (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category is being used by any books
    const Book = require('../models/Book');
    const booksUsingCategory = await Book.countDocuments({ category: category._id, isActive: true });
    
    if (booksUsingCategory > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. It is being used by ${booksUsingCategory} book(s).` 
      });
    }
    
    // Soft delete - mark as inactive
    category.isActive = false;
    await category.save();
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error while deleting category' });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
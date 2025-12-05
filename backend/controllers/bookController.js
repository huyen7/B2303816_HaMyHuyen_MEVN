const Book = require('../models/Book');
const Category = require('../models/Category');
const { paginate, getPaginationMeta, buildSearchQuery, buildFilterQuery } = require('../utils/pagination');
const path = require('path');
const fs = require('fs');

// Get all books with search, filter, and pagination
const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, author, available, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);
    
    // Build query
    let query = { isActive: true };
    
    // Search functionality
    if (search) {
      const searchQuery = buildSearchQuery(search, ['title', 'author', 'description']);
      query = { ...query, ...searchQuery };
    }
    
    // Filter functionality
    const filters = buildFilterQuery({
      category,
      author: author ? new RegExp(author, 'i') : undefined
    });
    query = { ...query, ...filters };
    
    // Available books filter
    if (available === 'true') {
      query.availableCopies = { $gt: 0 };
    }
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const [books, totalBooks] = await Promise.all([
      Book.find(query)
        .populate('category', 'name description')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Book.countDocuments(query)
    ]);
    
    const pagination = getPaginationMeta(totalBooks, pageNum, limitNum);
    
    res.json({
      books,
      pagination
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
};

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name description');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ book });
  } catch (error) {
    console.error('Get book error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID' });
    }
    res.status(500).json({ message: 'Server error while fetching book' });
  }
};

// Create new book (Admin only)
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, description, category, totalCopies, publishedYear, tags } = req.body;
    
    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    
    // Check if ISBN already exists
    if (isbn) {
      const existingBook = await Book.findOne({ isbn });
      if (existingBook) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
      }
    }
    
    // Handle cover image upload
    let coverImageUrl = null;
    if (req.file) {
      coverImageUrl = `/uploads/${req.file.filename}`;
    }
    
    const book = new Book({
      title,
      author,
      isbn,
      description,
      category,
      coverImageUrl,
      totalCopies,
      availableCopies: totalCopies, // Initially all copies are available
      publishedYear,
      tags
    });
    
    await book.save();
    await book.populate('category', 'name description');
    
    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error while creating book' });
  }
};

// Update book (Admin only)
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const { title, author, isbn, description, category, totalCopies, availableCopies, publishedYear, tags, isActive } = req.body;
    
    // Verify category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
    }
    
    // Check ISBN uniqueness if changed
    if (isbn && isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn, _id: { $ne: book._id } });
      if (existingBook) {
        return res.status(400).json({ message: 'Book with this ISBN already exists' });
      }
    }
    
    // Handle cover image upload
    if (req.file) {
      // Delete old image if exists
      if (book.coverImageUrl) {
        const oldImagePath = path.join(__dirname, '..', book.coverImageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      book.coverImageUrl = `/uploads/${req.file.filename}`;
    }
    
    // Update fields
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (isbn !== undefined) book.isbn = isbn;
    if (description !== undefined) book.description = description;
    if (category !== undefined) book.category = category;
    if (totalCopies !== undefined) book.totalCopies = totalCopies;
    if (availableCopies !== undefined) book.availableCopies = availableCopies;
    if (publishedYear !== undefined) book.publishedYear = publishedYear;
    if (tags !== undefined) book.tags = tags;
    if (isActive !== undefined) book.isActive = isActive;
    
    await book.save();
    await book.populate('category', 'name description');
    
    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error while updating book' });
  }
};

// Delete book (Admin only)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Soft delete - just mark as inactive
    book.isActive = false;
    await book.save();
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
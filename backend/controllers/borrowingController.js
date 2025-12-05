const BorrowingRequest = require('../models/BorrowingRequest');
const Book = require('../models/Book');
const User = require('../models/User');
const { paginate, getPaginationMeta } = require('../utils/pagination');

// Create borrowing request
const createBorrowingRequest = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // Check if book exists and is available
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!book.isActive) {
      return res.status(400).json({ message: 'Book is not available for borrowing' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    // Check if user already has a pending or approved request for this book
    const existingRequest = await BorrowingRequest.findOne({
      user: userId,
      book: bookId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return res.status(400).json({ 
        message: 'You already have a pending or active request for this book' 
      });
    }

    // Check user's borrowing limit (max 5 books at a time)
    const activeBorrowings = await BorrowingRequest.countDocuments({
      user: userId,
      status: { $in: ['approved', 'overdue'] }
    });

    if (activeBorrowings >= 5) {
      return res.status(400).json({ 
        message: 'You have reached the maximum borrowing limit (5 books)' 
      });
    }

    // Create borrowing request
    const borrowingRequest = new BorrowingRequest({
      user: userId,
      book: bookId
    });

    await borrowingRequest.save();
    await borrowingRequest.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'book', select: 'title author coverImageUrl' }
    ]);

    res.status(201).json({
      message: 'Borrowing request created successfully',
      borrowingRequest
    });
  } catch (error) {
    console.error('Create borrowing request error:', error);
    res.status(500).json({ message: 'Server error while creating borrowing request' });
  }
};

// Get user's borrowing requests
const getUserBorrowingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.params.userId || req.user._id;

    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const [requests, totalRequests] = await Promise.all([
      BorrowingRequest.find(query)
        .populate('book', 'title author coverImageUrl category')
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      BorrowingRequest.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(totalRequests, pageNum, limitNum);

    res.json({
      borrowingRequests: requests,
      pagination
    });
  } catch (error) {
    console.error('Get user borrowing requests error:', error);
    res.status(500).json({ message: 'Server error while fetching borrowing requests' });
  }
};

// Get all borrowing requests (Admin only)
const getAllBorrowingRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, bookId } = req.query;
    const { page: pageNum, limit: limitNum, skip } = paginate(page, limit);

    let query = {};
    if (status) query.status = status;
    if (userId) query.user = userId;
    if (bookId) query.book = bookId;

    const [requests, totalRequests] = await Promise.all([
      BorrowingRequest.find(query)
        .populate('user', 'firstName lastName email')
        .populate('book', 'title author coverImageUrl')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      BorrowingRequest.countDocuments(query)
    ]);

    const pagination = getPaginationMeta(totalRequests, pageNum, limitNum);

    res.json({
      borrowingRequests: requests,
      pagination
    });
  } catch (error) {
    console.error('Get all borrowing requests error:', error);
    res.status(500).json({ message: 'Server error while fetching borrowing requests' });
  }
};

// Approve borrowing request (Admin only)
const approveBorrowingRequest = async (req, res) => {
  try {
    const { borrowingPeriodDays = 14, adminNotes } = req.body;
    const requestId = req.params.id;

    const borrowingRequest = await BorrowingRequest.findById(requestId)
      .populate('book')
      .populate('user', 'firstName lastName email');

    if (!borrowingRequest) {
      return res.status(404).json({ message: 'Borrowing request not found' });
    }

    if (borrowingRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be approved' });
    }

    // Check if book is still available
    if (borrowingRequest.book.availableCopies <= 0) {
      return res.status(400).json({ message: 'Book is no longer available' });
    }

    // Approve the request
    await borrowingRequest.approve(borrowingPeriodDays);
    if (adminNotes) {
      borrowingRequest.adminNotes = adminNotes;
      await borrowingRequest.save();
    }

    // Update book availability
    await borrowingRequest.book.updateAvailability(-1);

    // Update user's borrowing history
    await User.findByIdAndUpdate(borrowingRequest.user._id, {
      $push: {
        borrowingHistory: {
          bookId: borrowingRequest.book._id,
          borrowDate: borrowingRequest.approvalDate,
          dueDate: borrowingRequest.dueDate,
          status: 'borrowed'
        }
      }
    });

    res.json({
      message: 'Borrowing request approved successfully',
      borrowingRequest
    });
  } catch (error) {
    console.error('Approve borrowing request error:', error);
    res.status(500).json({ message: 'Server error while approving borrowing request' });
  }
};

// Reject borrowing request (Admin only)
const rejectBorrowingRequest = async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const requestId = req.params.id;

    const borrowingRequest = await BorrowingRequest.findById(requestId)
      .populate('user', 'firstName lastName email')
      .populate('book', 'title author');

    if (!borrowingRequest) {
      return res.status(404).json({ message: 'Borrowing request not found' });
    }

    if (borrowingRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be rejected' });
    }

    // Reject the request
    await borrowingRequest.reject(adminNotes);

    res.json({
      message: 'Borrowing request rejected successfully',
      borrowingRequest
    });
  } catch (error) {
    console.error('Reject borrowing request error:', error);
    res.status(500).json({ message: 'Server error while rejecting borrowing request' });
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user._id;

    const borrowingRequest = await BorrowingRequest.findById(requestId)
      .populate('book')
      .populate('user', 'firstName lastName email');

    if (!borrowingRequest) {
      return res.status(404).json({ message: 'Borrowing request not found' });
    }

    // Check if user owns this request or is admin
    if (req.user.role !== 'admin' && borrowingRequest.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!['approved', 'overdue'].includes(borrowingRequest.status)) {
      return res.status(400).json({ message: 'Only approved or overdue books can be returned' });
    }

    // Return the book
    await borrowingRequest.returnBook();

    // Update book availability
    await borrowingRequest.book.updateAvailability(1);

    // Update user's borrowing history
    await User.findByIdAndUpdate(borrowingRequest.user._id, {
      $set: {
        'borrowingHistory.$[elem].returnDate': borrowingRequest.returnDate,
        'borrowingHistory.$[elem].status': 'returned'
      }
    }, {
      arrayFilters: [{ 'elem.bookId': borrowingRequest.book._id, 'elem.status': { $in: ['borrowed', 'overdue'] } }]
    });

    res.json({
      message: 'Book returned successfully',
      borrowingRequest,
      overdueFee: borrowingRequest.overdueFee
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ message: 'Server error while returning book' });
  }
};

module.exports = {
  createBorrowingRequest,
  getUserBorrowingRequests,
  getAllBorrowingRequests,
  approveBorrowingRequest,
  rejectBorrowingRequest,
  returnBook
};
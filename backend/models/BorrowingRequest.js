const mongoose = require('mongoose');

const borrowingRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned', 'overdue'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  overdueFee: {
    type: Number,
    default: 0,
    min: [0, 'Overdue fee cannot be negative']
  },
  overdueFeePaid: {
    type: Boolean,
    default: false
  },
  borrowingPeriodDays: {
    type: Number,
    default: 14,
    min: [1, 'Borrowing period must be at least 1 day'],
    max: [90, 'Borrowing period cannot exceed 90 days']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
borrowingRequestSchema.index({ user: 1, status: 1 });
borrowingRequestSchema.index({ book: 1, status: 1 });
borrowingRequestSchema.index({ status: 1 });
borrowingRequestSchema.index({ dueDate: 1 });
borrowingRequestSchema.index({ requestDate: 1 });

// Virtual for days overdue
borrowingRequestSchema.virtual('daysOverdue').get(function() {
  if (!this.dueDate || this.status === 'returned') return 0;
  
  const now = new Date();
  const dueDate = new Date(this.dueDate);
  
  if (now <= dueDate) return 0;
  
  const diffTime = now - dueDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for calculated overdue fee
borrowingRequestSchema.virtual('calculatedOverdueFee').get(function() {
  const daysOverdue = this.daysOverdue;
  if (daysOverdue <= 0) return 0;
  
  // Fee calculation: 5000 VND per day overdue
  const feePerDay = 5000;
  return daysOverdue * feePerDay;
});

// Method to approve request
borrowingRequestSchema.methods.approve = function(borrowingDays = 14) {
  this.status = 'approved';
  this.approvalDate = new Date();
  this.borrowingPeriodDays = borrowingDays;
  this.dueDate = new Date(Date.now() + (borrowingDays * 24 * 60 * 60 * 1000));
  return this.save();
};

// Method to reject request
borrowingRequestSchema.methods.reject = function(reason = '') {
  this.status = 'rejected';
  this.adminNotes = reason;
  return this.save();
};

// Method to return book
borrowingRequestSchema.methods.returnBook = function() {
  this.status = 'returned';
  this.returnDate = new Date();
  
  // Calculate overdue fee if applicable
  if (this.daysOverdue > 0) {
    this.overdueFee = this.calculatedOverdueFee;
  }
  
  return this.save();
};

// Method to check if overdue
borrowingRequestSchema.methods.checkOverdue = function() {
  if (this.status === 'approved' && this.dueDate && new Date() > this.dueDate) {
    this.status = 'overdue';
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('BorrowingRequest', borrowingRequestSchema);
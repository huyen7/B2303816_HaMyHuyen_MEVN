// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  borrowingHistory?: BorrowingHistoryItem[];
  createdAt: string;
  borrowingStats?: BorrowingStats;
}

export interface BorrowingHistoryItem {
  bookId: string;
  borrowDate: string;
  returnDate?: string;
  dueDate: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface BorrowingStats {
  totalRequests: number;
  pending: number;
  approved: number;
  returned: number;
  overdue: number;
  rejected: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  category: Category;
  coverImageUrl?: string;
  totalCopies: number;
  availableCopies: number;
  publishedYear?: number;
  isActive: boolean;
  tags?: string[];
  isAvailable?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  category: string;
  totalCopies: number;
  availableCopies?: number;
  publishedYear?: number;
  tags?: string[];
  coverImage?: File;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Borrowing types
export interface BorrowingRequest {
  _id: string;
  user: User;
  book: Book;
  requestDate: string;
  approvalDate?: string;
  dueDate?: string;
  returnDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'overdue';
  adminNotes?: string;
  overdueFee: number;
  overdueFeePaid: boolean;
  borrowingPeriodDays: number;
  daysOverdue?: number;
  calculatedOverdueFee?: number;
  createdAt: string;
  updatedAt: string;
}

// Pagination types
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// API Response types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

export interface BooksResponse {
  books: Book[];
  pagination: PaginationMeta;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface BorrowingRequestsResponse {
  borrowingRequests: BorrowingRequest[];
  pagination: PaginationMeta;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationMeta;
}

// Dashboard types
export interface UserDashboard {
  currentBorrowings: BorrowingRequest[];
  recentHistory: BorrowingRequest[];
  pendingRequests: BorrowingRequest[];
  stats: {
    totalBorrowed: number;
    currentlyBorrowed: number;
    overdue: number;
    pending: number;
  };
}

// Search and filter types
export interface BookFilters {
  search?: string;
  category?: string;
  author?: string;
  available?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserFilters {
  search?: string;
  role?: 'user' | 'admin';
  page?: number;
  limit?: number;
}

export interface BorrowingFilters {
  status?: string;
  userId?: string;
  bookId?: string;
  page?: number;
  limit?: number;
}
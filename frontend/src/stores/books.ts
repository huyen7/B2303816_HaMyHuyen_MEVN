import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiRequest, uploadFile } from '@/services/api';
import type { Book, BookFormData, BooksResponse, BookFilters, Category } from '@/types';

export const useBooksStore = defineStore('books', () => {
  // State
  const books = ref<Book[]>([]);
  const currentBook = ref<Book | null>(null);
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null
  });

  // Actions
  const fetchBooks = async (filters: BookFilters = {}): Promise<void> => {
    isLoading.value = true;
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response: BooksResponse = await apiRequest.get(`/books?${queryParams.toString()}`);
      
      books.value = response.books;
      pagination.value = response.pagination;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch books');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchBookById = async (id: string): Promise<void> => {
    isLoading.value = true;
    
    try {
      const response = await apiRequest.get(`/books/${id}`);
      currentBook.value = response.book;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch book');
    } finally {
      isLoading.value = false;
    }
  };

  const createBook = async (bookData: BookFormData): Promise<Book> => {
    isLoading.value = true;
    
    try {
      let response;
      
      if (bookData.coverImage) {
        // Upload with file
        const formData = new FormData();
        Object.entries(bookData).forEach(([key, value]) => {
          if (key === 'coverImage' && value instanceof File) {
            formData.append('coverImage', value);
          } else if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        
        response = await apiRequest.post('/books', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Regular JSON request
        const { coverImage, ...dataWithoutFile } = bookData;
        response = await apiRequest.post('/books', dataWithoutFile);
      }
      
      const newBook = response.book;
      books.value.unshift(newBook);
      
      return newBook;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create book');
    } finally {
      isLoading.value = false;
    }
  };

  const updateBook = async (id: string, bookData: Partial<BookFormData>): Promise<Book> => {
    isLoading.value = true;
    
    try {
      let response;
      
      if (bookData.coverImage) {
        // Upload with file
        const formData = new FormData();
        Object.entries(bookData).forEach(([key, value]) => {
          if (key === 'coverImage' && value instanceof File) {
            formData.append('coverImage', value);
          } else if (key === 'tags' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        
        response = await apiRequest.put(`/books/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        // Regular JSON request
        const { coverImage, ...dataWithoutFile } = bookData;
        response = await apiRequest.put(`/books/${id}`, dataWithoutFile);
      }
      
      const updatedBook = response.book;
      
      // Update in books array
      const index = books.value.findIndex(book => book._id === id);
      if (index !== -1) {
        books.value[index] = updatedBook;
      }
      
      // Update current book if it's the same
      if (currentBook.value?._id === id) {
        currentBook.value = updatedBook;
      }
      
      return updatedBook;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update book');
    } finally {
      isLoading.value = false;
    }
  };

  const deleteBook = async (id: string): Promise<void> => {
    isLoading.value = true;
    
    try {
      await apiRequest.delete(`/books/${id}`);
      
      // Remove from books array
      books.value = books.value.filter(book => book._id !== id);
      
      // Clear current book if it's the deleted one
      if (currentBook.value?._id === id) {
        currentBook.value = null;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete book');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await apiRequest.get('/categories');
      categories.value = response.categories;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  };

  const clearCurrentBook = () => {
    currentBook.value = null;
  };

  const clearBooks = () => {
    books.value = [];
    pagination.value = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null
    };
  };

  return {
    // State
    books,
    currentBook,
    categories,
    isLoading,
    pagination,
    
    // Actions
    fetchBooks,
    fetchBookById,
    createBook,
    updateBook,
    deleteBook,
    fetchCategories,
    clearCurrentBook,
    clearBooks
  };
});
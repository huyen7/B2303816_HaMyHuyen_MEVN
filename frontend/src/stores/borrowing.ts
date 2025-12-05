import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiRequest } from '@/services/api';
import type { BorrowingRequest, BorrowingRequestsResponse, BorrowingFilters, UserDashboard } from '@/types';

export const useBorrowingStore = defineStore('borrowing', () => {
  // State
  const borrowingRequests = ref<BorrowingRequest[]>([]);
  const userBorrowings = ref<BorrowingRequest[]>([]);
  const dashboardData = ref<UserDashboard | null>(null);
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
  const createBorrowingRequest = async (bookId: string): Promise<BorrowingRequest> => {
    isLoading.value = true;
    
    try {
      const response = await apiRequest.post('/borrowing/request', { bookId });
      const newRequest = response.borrowingRequest;
      
      // Add to user borrowings if it's the current user
      userBorrowings.value.unshift(newRequest);
      
      return newRequest;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create borrowing request');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserBorrowings = async (userId?: string, filters: BorrowingFilters = {}): Promise<void> => {
    isLoading.value = true;
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = userId 
        ? `/borrowing/user/${userId}?${queryParams.toString()}`
        : `/borrowing/user?${queryParams.toString()}`;
        
      const response: BorrowingRequestsResponse = await apiRequest.get(url);
      
      userBorrowings.value = response.borrowingRequests;
      pagination.value = response.pagination;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user borrowings');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAllBorrowingRequests = async (filters: BorrowingFilters = {}): Promise<void> => {
    isLoading.value = true;
    
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response: BorrowingRequestsResponse = await apiRequest.get(`/borrowing?${queryParams.toString()}`);
      
      borrowingRequests.value = response.borrowingRequests;
      pagination.value = response.pagination;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch borrowing requests');
    } finally {
      isLoading.value = false;
    }
  };

  const approveBorrowingRequest = async (
    requestId: string, 
    borrowingPeriodDays: number = 14, 
    adminNotes?: string
  ): Promise<BorrowingRequest> => {
    isLoading.value = true;
    
    try {
      const response = await apiRequest.put(`/borrowing/${requestId}/approve`, {
        borrowingPeriodDays,
        adminNotes
      });
      
      const updatedRequest = response.borrowingRequest;
      
      // Update in borrowing requests array
      const index = borrowingRequests.value.findIndex(req => req._id === requestId);
      if (index !== -1) {
        borrowingRequests.value[index] = updatedRequest;
      }
      
      return updatedRequest;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to approve borrowing request');
    } finally {
      isLoading.value = false;
    }
  };

  const rejectBorrowingRequest = async (requestId: string, adminNotes: string): Promise<BorrowingRequest> => {
    isLoading.value = true;
    
    try {
      const response = await apiRequest.put(`/borrowing/${requestId}/reject`, {
        adminNotes
      });
      
      const updatedRequest = response.borrowingRequest;
      
      // Update in borrowing requests array
      const index = borrowingRequests.value.findIndex(req => req._id === requestId);
      if (index !== -1) {
        borrowingRequests.value[index] = updatedRequest;
      }
      
      return updatedRequest;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reject borrowing request');
    } finally {
      isLoading.value = false;
    }
  };

  const returnBook = async (requestId: string): Promise<BorrowingRequest> => {
    isLoading.value = true;
    
    try {
      const response = await apiRequest.put(`/borrowing/${requestId}/return`);
      const updatedRequest = response.borrowingRequest;
      
      // Update in both arrays
      const borrowingIndex = borrowingRequests.value.findIndex(req => req._id === requestId);
      if (borrowingIndex !== -1) {
        borrowingRequests.value[borrowingIndex] = updatedRequest;
      }
      
      const userIndex = userBorrowings.value.findIndex(req => req._id === requestId);
      if (userIndex !== -1) {
        userBorrowings.value[userIndex] = updatedRequest;
      }
      
      return updatedRequest;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to return book');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUserDashboard = async (): Promise<void> => {
    isLoading.value = true;
    
    try {
      const response = await apiRequest.get('/users/dashboard');
      dashboardData.value = response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      isLoading.value = false;
    }
  };

  const clearBorrowingRequests = () => {
    borrowingRequests.value = [];
    userBorrowings.value = [];
    dashboardData.value = null;
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
    borrowingRequests,
    userBorrowings,
    dashboardData,
    isLoading,
    pagination,
    
    // Actions
    createBorrowingRequest,
    fetchUserBorrowings,
    fetchAllBorrowingRequests,
    approveBorrowingRequest,
    rejectBorrowingRequest,
    returnBook,
    fetchUserDashboard,
    clearBorrowingRequests
  };
});
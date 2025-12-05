<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Tổng quan hệ thống và quản lý hoạt động</p>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Tổng số sách</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalBooks }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Người dùng</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Chờ duyệt</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.pendingRequests }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Quá hạn</p>
              <p class="text-2xl font-semibold text-gray-900">{{ stats.overdueBooks }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Thao tác nhanh</h2>
          </div>
          <div class="p-6 space-y-4">
            <router-link to="/admin/books" class="block">
              <BaseButton variant="outline" full-width>
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Thêm sách mới
              </BaseButton>
            </router-link>
            
            <router-link to="/admin/borrowing-requests" class="block">
              <BaseButton variant="outline" full-width>
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Xem yêu cầu mượn
              </BaseButton>
            </router-link>
            
            <router-link to="/admin/users" class="block">
              <BaseButton variant="outline" full-width>
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                Quản lý người dùng
              </BaseButton>
            </router-link>
          </div>
        </div>

        <!-- Recent Borrowing Requests -->
        <div class="lg:col-span-2 card">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Yêu cầu mượn gần đây</h2>
            <router-link to="/admin/borrowing-requests" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả →
            </router-link>
          </div>
          
          <div v-if="isLoading" class="p-6">
            <div class="animate-pulse space-y-4">
              <div v-for="i in 3" :key="i" class="flex space-x-4">
                <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-300 rounded"></div>
                  <div class="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="recentRequests.length === 0" class="p-6 text-center">
            <p class="text-gray-500">Không có yêu cầu mượn nào gần đây</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="request in recentRequests"
              :key="request._id"
              class="p-6 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span class="text-primary-600 font-medium text-sm">
                        {{ getUserInitials(request.user) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ request.user.firstName }} {{ request.user.lastName }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ request.book.title }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ formatRelativeTime(request.requestDate) }}
                    </p>
                  </div>
                </div>
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(request.status)
                  ]"
                >
                  {{ getStatusText(request.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBorrowingStore } from '@/stores/borrowing';
import { apiRequest } from '@/services/api';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { formatRelativeTime, getStatusText, getStatusColor } from '@/utils/formatters';
import type { BorrowingRequest, User } from '@/types';

const borrowingStore = useBorrowingStore();

const stats = ref({
  totalBooks: 0,
  totalUsers: 0,
  pendingRequests: 0,
  overdueBooks: 0
});

const recentRequests = ref<BorrowingRequest[]>([]);
const isLoading = ref(true);

const getUserInitials = (user: User): string => {
  return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
};

const fetchDashboardData = async () => {
  try {
    isLoading.value = true;
    
    // Fetch dashboard statistics
    const [booksResponse, usersResponse, borrowingResponse] = await Promise.all([
      apiRequest.get('/books?limit=1'),
      apiRequest.get('/users?limit=1'),
      apiRequest.get('/borrowing?limit=5&sortBy=createdAt&sortOrder=desc')
    ]);
    
    stats.value = {
      totalBooks: booksResponse.pagination?.totalItems || 0,
      totalUsers: usersResponse.pagination?.totalItems || 0,
      pendingRequests: 0,
      overdueBooks: 0
    };
    
    recentRequests.value = borrowingResponse.borrowingRequests || [];
    
    // Count pending and overdue requests
    const pendingResponse = await apiRequest.get('/borrowing?status=pending&limit=1');
    const overdueResponse = await apiRequest.get('/borrowing?status=overdue&limit=1');
    
    stats.value.pendingRequests = pendingResponse.pagination?.totalItems || 0;
    stats.value.overdueBooks = overdueResponse.pagination?.totalItems || 0;
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>
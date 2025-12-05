<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Chào mừng, {{ authStore.user?.firstName }}!
        </h1>
        <p class="text-gray-600">Quản lý sách mượn và theo dõi hoạt động của bạn</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p class="text-sm font-medium text-gray-500">Đang mượn</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.currentlyBorrowed }}</p>
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
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.pending }}</p>
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
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.overdue }}</p>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Đã mượn</p>
              <p class="text-2xl font-semibold text-gray-900">{{ dashboardStats.totalBorrowed }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Current Borrowings -->
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Sách đang mượn</h2>
          </div>
          
          <div v-if="borrowingStore.isLoading" class="p-6">
            <div class="animate-pulse space-y-4">
              <div v-for="i in 3" :key="i" class="flex space-x-4">
                <div class="w-16 h-20 bg-gray-300 rounded"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-300 rounded"></div>
                  <div class="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else-if="currentBorrowings.length === 0" class="p-6 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Không có sách đang mượn</h3>
            <p class="mt-1 text-sm text-gray-500">Hãy khám phá thư viện để mượn sách mới</p>
            <div class="mt-6">
              <router-link to="/books">
                <BaseButton variant="primary">Khám phá sách</BaseButton>
              </router-link>
            </div>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <BorrowingItem
              v-for="borrowing in currentBorrowings"
              :key="borrowing._id"
              :borrowing="borrowing"
              :show-actions="true"
              @return="handleReturnBook"
            />
          </div>
        </div>

        <!-- Pending Requests -->
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Yêu cầu chờ duyệt</h2>
          </div>
          
          <div v-if="pendingRequests.length === 0" class="p-6 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu chờ duyệt</h3>
            <p class="mt-1 text-sm text-gray-500">Các yêu cầu mượn sách của bạn sẽ hiển thị ở đây</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <BorrowingItem
              v-for="request in pendingRequests"
              :key="request._id"
              :borrowing="request"
              :show-actions="false"
            />
          </div>
        </div>
      </div>

      <!-- Recent History -->
      <div class="mt-8">
        <div class="card">
          <div class="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Lịch sử mượn gần đây</h2>
            <router-link to="/borrowing-history" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Xem tất cả →
            </router-link>
          </div>
          
          <div v-if="recentHistory.length === 0" class="p-6 text-center">
            <h3 class="text-sm font-medium text-gray-900">Chưa có lịch sử mượn sách</h3>
            <p class="mt-1 text-sm text-gray-500">Lịch sử mượn sách của bạn sẽ hiển thị ở đây</p>
          </div>
          
          <div v-else class="divide-y divide-gray-200">
            <BorrowingItem
              v-for="history in recentHistory"
              :key="history._id"
              :borrowing="history"
              :show-actions="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBorrowingStore } from '@/stores/borrowing';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BorrowingItem from '@/components/borrowing/BorrowingItem.vue';

const authStore = useAuthStore();
const borrowingStore = useBorrowingStore();

const currentBorrowings = computed(() => borrowingStore.dashboardData?.currentBorrowings || []);
const pendingRequests = computed(() => borrowingStore.dashboardData?.pendingRequests || []);
const recentHistory = computed(() => borrowingStore.dashboardData?.recentHistory || []);
const dashboardStats = computed(() => borrowingStore.dashboardData?.stats || {
  totalBorrowed: 0,
  currentlyBorrowed: 0,
  overdue: 0,
  pending: 0
});

const handleReturnBook = async (borrowingId: string) => {
  if (confirm('Bạn có chắc chắn muốn trả sách này?')) {
    try {
      await borrowingStore.returnBook(borrowingId);
      // Refresh dashboard data
      await borrowingStore.fetchUserDashboard();
      alert('Trả sách thành công!');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi trả sách');
    }
  }
};

onMounted(async () => {
  try {
    await borrowingStore.fetchUserDashboard();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
});
</script>
<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý yêu cầu mượn sách</h1>
        <p class="text-gray-600">Phê duyệt và theo dõi các yêu cầu mượn sách</p>
      </div>

      <!-- Filters -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
            <select
              v-model="filters.status"
              class="input"
              @change="handleFilterChange"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="returned">Đã trả</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo</label>
            <select
              v-model="filters.sortBy"
              class="input"
              @change="handleFilterChange"
            >
              <option value="createdAt">Ngày yêu cầu</option>
              <option value="approvalDate">Ngày duyệt</option>
              <option value="dueDate">Hạn trả</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
            <select
              v-model="filters.sortOrder"
              class="input"
              @change="handleFilterChange"
            >
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>
          
          <div class="flex items-end">
            <BaseButton
              @click="handleFilterChange"
              variant="outline"
              class="w-full"
            >
              Lọc
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Borrowing Requests List -->
      <div class="card">
        <div v-if="borrowingStore.isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="flex space-x-4">
              <div class="w-16 h-20 bg-gray-300 rounded"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-300 rounded"></div>
                <div class="h-3 bg-gray-300 rounded w-3/4"></div>
                <div class="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="borrowingStore.borrowingRequests.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu mượn sách</h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ filters.status ? 'Không tìm thấy yêu cầu nào với bộ lọc hiện tại' : 'Chưa có yêu cầu mượn sách nào' }}
          </p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <AdminBorrowingItem
            v-for="request in borrowingStore.borrowingRequests"
            :key="request._id"
            :borrowing="request"
            @approve="handleApprove"
            @reject="handleReject"
          />
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="borrowingStore.pagination.totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="!borrowingStore.pagination.hasPrevPage"
            @click="changePage(borrowingStore.pagination.prevPage)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === borrowingStore.pagination.currentPage
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            :disabled="!borrowingStore.pagination.hasNextPage"
            @click="changePage(borrowingStore.pagination.nextPage)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </nav>
      </div>
    </div>

    <!-- Approve Modal -->
    <ApprovalModal
      v-if="showApprovalModal"
      :borrowing="selectedBorrowing"
      @approve="confirmApprove"
      @cancel="cancelApproval"
    />

    <!-- Reject Modal -->
    <RejectModal
      v-if="showRejectModal"
      :borrowing="selectedBorrowing"
      @reject="confirmReject"
      @cancel="cancelReject"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBorrowingStore } from '@/stores/borrowing';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import AdminBorrowingItem from '@/components/admin/AdminBorrowingItem.vue';
import ApprovalModal from '@/components/admin/ApprovalModal.vue';
import RejectModal from '@/components/admin/RejectModal.vue';
import type { BorrowingRequest } from '@/types';

const route = useRoute();
const router = useRouter();
const borrowingStore = useBorrowingStore();

const filters = ref({
  status: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  limit: 10
});

const showApprovalModal = ref(false);
const showRejectModal = ref(false);
const selectedBorrowing = ref<BorrowingRequest | null>(null);

const visiblePages = computed(() => {
  const current = borrowingStore.pagination.currentPage;
  const total = borrowingStore.pagination.totalPages;
  const delta = 2;
  
  const range = [];
  const rangeWithDots = [];
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }
  
  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }
  
  rangeWithDots.push(...range);
  
  if (current + delta < total - 1) {
    rangeWithDots.push('...', total);
  } else if (total > 1) {
    rangeWithDots.push(total);
  }
  
  return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
});

const handleFilterChange = () => {
  filters.value.page = 1;
  fetchRequests();
  updateURL();
};

const changePage = (page: number | null) => {
  if (page) {
    filters.value.page = page;
    fetchRequests();
    updateURL();
  }
};

const fetchRequests = async () => {
  try {
    const queryFilters = { ...filters.value };
    
    // Remove empty values
    Object.keys(queryFilters).forEach(key => {
      if (queryFilters[key] === '' || queryFilters[key] === null || queryFilters[key] === undefined) {
        delete queryFilters[key];
      }
    });
    
    await borrowingStore.fetchAllBorrowingRequests(queryFilters);
  } catch (error) {
    console.error('Error fetching borrowing requests:', error);
  }
};

const updateURL = () => {
  const query = { ...filters.value };
  
  // Remove default values
  if (query.sortBy === 'createdAt') delete query.sortBy;
  if (query.sortOrder === 'desc') delete query.sortOrder;
  if (query.page === 1) delete query.page;
  if (query.limit === 10) delete query.limit;
  
  // Remove empty values
  Object.keys(query).forEach(key => {
    if (query[key] === '' || query[key] === null || query[key] === undefined) {
      delete query[key];
    }
  });
  
  router.replace({ query });
};

const initializeFromURL = () => {
  const query = route.query;
  
  filters.value = {
    status: (query.status as string) || '',
    sortBy: (query.sortBy as string) || 'createdAt',
    sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc',
    page: parseInt(query.page as string) || 1,
    limit: parseInt(query.limit as string) || 10
  };
};

const handleApprove = (borrowing: BorrowingRequest) => {
  selectedBorrowing.value = borrowing;
  showApprovalModal.value = true;
};

const handleReject = (borrowing: BorrowingRequest) => {
  selectedBorrowing.value = borrowing;
  showRejectModal.value = true;
};

const confirmApprove = async (data: { borrowingPeriodDays: number; adminNotes?: string }) => {
  if (!selectedBorrowing.value) return;
  
  try {
    await borrowingStore.approveBorrowingRequest(
      selectedBorrowing.value._id,
      data.borrowingPeriodDays,
      data.adminNotes
    );
    
    showApprovalModal.value = false;
    selectedBorrowing.value = null;
    
    alert('Yêu cầu đã được phê duyệt thành công!');
  } catch (error: any) {
    alert(error.message || 'Có lỗi xảy ra khi phê duyệt yêu cầu');
  }
};

const confirmReject = async (adminNotes: string) => {
  if (!selectedBorrowing.value) return;
  
  try {
    await borrowingStore.rejectBorrowingRequest(selectedBorrowing.value._id, adminNotes);
    
    showRejectModal.value = false;
    selectedBorrowing.value = null;
    
    alert('Yêu cầu đã được từ chối!');
  } catch (error: any) {
    alert(error.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
  }
};

const cancelApproval = () => {
  showApprovalModal.value = false;
  selectedBorrowing.value = null;
};

const cancelReject = () => {
  showRejectModal.value = false;
  selectedBorrowing.value = null;
};

onMounted(() => {
  initializeFromURL();
  fetchRequests();
});

// Watch for route changes (back/forward navigation)
watch(() => route.query, () => {
  initializeFromURL();
  fetchRequests();
});
</script>
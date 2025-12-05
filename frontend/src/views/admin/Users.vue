<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý người dùng</h1>
        <p class="text-gray-600">Xem và quản lý tài khoản người dùng</p>
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <BaseInput
              v-model="filters.search"
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              @input="debouncedSearch"
            />
          </div>
          
          <div>
            <select
              v-model="filters.role"
              class="input"
              @change="handleFilterChange"
            >
              <option value="">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card overflow-hidden">
        <div v-if="isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="flex space-x-4">
              <div class="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-300 rounded"></div>
                <div class="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="users.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy người dùng</h3>
          <p class="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc tìm kiếm</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span class="text-primary-600 font-medium text-sm">
                          {{ getUserInitials(user) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.firstName }} {{ user.lastName }}
                      </div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    ]"
                  >
                    {{ user.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      user.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    ]"
                  >
                    {{ user.isEmailVerified ? 'Đã xác minh' : 'Chưa xác minh' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <BaseButton @click="viewUser(user)" variant="outline" size="sm">
                    Xem
                  </BaseButton>
                  <BaseButton 
                    v-if="user.role !== 'admin' || user.id !== authStore.user?.id"
                    @click="deleteUser(user)" 
                    variant="danger" 
                    size="sm"
                  >
                    Xóa
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="!pagination.hasPrevPage"
            @click="changePage(pagination.prevPage)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          <span class="px-3 py-2 text-sm text-gray-700">
            Trang {{ pagination.currentPage }} / {{ pagination.totalPages }}
          </span>
          
          <button
            :disabled="!pagination.hasNextPage"
            @click="changePage(pagination.nextPage)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { apiRequest } from '@/services/api';
import { debounce, formatDate } from '@/utils/formatters';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import type { User } from '@/types';

const authStore = useAuthStore();

const users = ref<User[]>([]);
const isLoading = ref(false);
const filters = ref({
  search: '',
  role: '',
  page: 1,
  limit: 10
});

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

const debouncedSearch = debounce(() => {
  handleFilterChange();
}, 500);

const handleFilterChange = () => {
  filters.value.page = 1;
  fetchUsers();
};

const changePage = (page: number | null) => {
  if (page) {
    filters.value.page = page;
    fetchUsers();
  }
};

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    
    const queryFilters = { ...filters.value };
    
    // Remove empty values
    Object.keys(queryFilters).forEach(key => {
      if (queryFilters[key] === '' || queryFilters[key] === null || queryFilters[key] === undefined) {
        delete queryFilters[key];
      }
    });
    
    const queryParams = new URLSearchParams();
    Object.entries(queryFilters).forEach(([key, value]) => {
      queryParams.append(key, value.toString());
    });
    
    const response = await apiRequest.get(`/users?${queryParams.toString()}`);
    
    users.value = response.users;
    pagination.value = response.pagination;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
};

const getUserInitials = (user: User): string => {
  return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
};

const viewUser = (user: User) => {
  // Navigate to user detail page or show modal
  alert(`Xem chi tiết người dùng: ${user.firstName} ${user.lastName}`);
};

const deleteUser = async (user: User) => {
  if (confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.firstName} ${user.lastName}"?`)) {
    try {
      await apiRequest.delete(`/users/${user._id}`);
      alert('Xóa người dùng thành công!');
      await fetchUsers(); // Refresh the list
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa người dùng');
    }
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
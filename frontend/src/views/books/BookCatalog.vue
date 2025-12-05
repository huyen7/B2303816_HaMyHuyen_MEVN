<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Danh mục sách</h1>
        <p class="text-gray-600">Khám phá thư viện với hàng ngàn đầu sách phong phú</p>
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="md:col-span-2">
            <BaseInput
              v-model="filters.search"
              type="text"
              placeholder="Tìm kiếm theo tên sách, tác giả..."
              @input="debouncedSearch"
            />
          </div>
          
          <!-- Category Filter -->
          <div>
            <select
              v-model="filters.category"
              class="input"
              @change="handleFilterChange"
            >
              <option value="">Tất cả thể loại</option>
              <option
                v-for="category in booksStore.categories"
                :key="category._id"
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <!-- Availability Filter -->
          <div>
            <select
              v-model="filters.available"
              class="input"
              @change="handleFilterChange"
            >
              <option value="">Tất cả sách</option>
              <option value="true">Có sẵn</option>
              <option value="false">Hết sách</option>
            </select>
          </div>
        </div>
        
        <!-- Sort Options -->
        <div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-200">
          <span class="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
          
          <div class="flex items-center space-x-2">
            <select
              v-model="filters.sortBy"
              class="text-sm border border-gray-300 rounded px-3 py-1"
              @change="handleFilterChange"
            >
              <option value="createdAt">Ngày thêm</option>
              <option value="title">Tên sách</option>
              <option value="author">Tác giả</option>
              <option value="publishedYear">Năm xuất bản</option>
            </select>
            
            <button
              @click="toggleSortOrder"
              class="p-1 text-gray-500 hover:text-gray-700"
            >
              <svg
                class="w-4 h-4 transform transition-transform"
                :class="{ 'rotate-180': filters.sortOrder === 'desc' }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
          
          <div class="ml-auto text-sm text-gray-500">
            {{ booksStore.pagination.totalItems }} kết quả
          </div>
        </div>
      </div>

      <!-- Books Grid -->
      <div v-if="booksStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="i in 8" :key="i" class="animate-pulse">
          <div class="bg-gray-300 h-64 rounded-lg mb-4"></div>
          <div class="h-4 bg-gray-300 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
      
      <div v-else-if="booksStore.books.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">Không tìm thấy sách</h3>
        <p class="mt-1 text-sm text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <BookCard
          v-for="book in booksStore.books"
          :key="book._id"
          :book="book"
        />
      </div>

      <!-- Pagination -->
      <div v-if="booksStore.pagination.totalPages > 1" class="flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="!booksStore.pagination.hasPrevPage"
            @click="changePage(booksStore.pagination.prevPage)"
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
                page === booksStore.pagination.currentPage
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            :disabled="!booksStore.pagination.hasNextPage"
            @click="changePage(booksStore.pagination.nextPage)"
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBooksStore } from '@/stores/books';
import { debounce } from '@/utils/formatters';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BookCard from '@/components/books/BookCard.vue';

const route = useRoute();
const router = useRouter();
const booksStore = useBooksStore();

const filters = ref({
  search: '',
  category: '',
  available: '',
  sortBy: 'createdAt',
  sortOrder: 'desc' as 'asc' | 'desc',
  page: 1,
  limit: 12
});

const visiblePages = computed(() => {
  const current = booksStore.pagination.currentPage;
  const total = booksStore.pagination.totalPages;
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

const debouncedSearch = debounce(() => {
  handleFilterChange();
}, 500);

const handleFilterChange = () => {
  filters.value.page = 1;
  fetchBooks();
  updateURL();
};

const toggleSortOrder = () => {
  filters.value.sortOrder = filters.value.sortOrder === 'asc' ? 'desc' : 'asc';
  handleFilterChange();
};

const changePage = (page: number | null) => {
  if (page) {
    filters.value.page = page;
    fetchBooks();
    updateURL();
  }
};

const fetchBooks = async () => {
  try {
    const queryFilters = { ...filters.value };
    
    // Convert string booleans to actual booleans
    if (queryFilters.available === 'true') {
      queryFilters.available = true;
    } else if (queryFilters.available === 'false') {
      queryFilters.available = false;
    } else {
      delete queryFilters.available;
    }
    
    // Remove empty values
    Object.keys(queryFilters).forEach(key => {
      if (queryFilters[key] === '' || queryFilters[key] === null || queryFilters[key] === undefined) {
        delete queryFilters[key];
      }
    });
    
    await booksStore.fetchBooks(queryFilters);
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

const updateURL = () => {
  const query = { ...filters.value };
  
  // Remove default values
  if (query.sortBy === 'createdAt') delete query.sortBy;
  if (query.sortOrder === 'desc') delete query.sortOrder;
  if (query.page === 1) delete query.page;
  if (query.limit === 12) delete query.limit;
  
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
    search: (query.search as string) || '',
    category: (query.category as string) || '',
    available: (query.available as string) || '',
    sortBy: (query.sortBy as string) || 'createdAt',
    sortOrder: (query.sortOrder as 'asc' | 'desc') || 'desc',
    page: parseInt(query.page as string) || 1,
    limit: parseInt(query.limit as string) || 12
  };
};

onMounted(async () => {
  initializeFromURL();
  
  // Fetch categories for filter dropdown
  try {
    await booksStore.fetchCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
  
  // Fetch books
  await fetchBooks();
});

// Watch for route changes (back/forward navigation)
watch(() => route.query, () => {
  initializeFromURL();
  fetchBooks();
});
</script>
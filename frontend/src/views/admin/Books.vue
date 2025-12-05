<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản lý sách</h1>
          <p class="text-gray-600">Thêm, sửa và quản lý thư viện sách</p>
        </div>
        
        <BaseButton @click="showCreateModal = true" variant="primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Thêm sách mới
        </BaseButton>
      </div>

      <!-- Search and Filters -->
      <div class="card p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <BaseInput
              v-model="filters.search"
              type="text"
              placeholder="Tìm kiếm theo tên sách, tác giả..."
              @input="debouncedSearch"
            />
          </div>
          
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
      </div>

      <!-- Books Table -->
      <div class="card overflow-hidden">
        <div v-if="booksStore.isLoading" class="p-6">
          <div class="animate-pulse space-y-4">
            <div v-for="i in 5" :key="i" class="flex space-x-4">
              <div class="w-16 h-20 bg-gray-300 rounded"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-300 rounded"></div>
                <div class="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="booksStore.books.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Không có sách nào</h3>
          <p class="mt-1 text-sm text-gray-500">Bắt đầu bằng cách thêm sách mới vào thư viện</p>
          <div class="mt-6">
            <BaseButton @click="showCreateModal = true" variant="primary">
              Thêm sách đầu tiên
            </BaseButton>
          </div>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sách
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thể loại
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="book in booksStore.books" :key="book._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-16 w-12">
                      <img
                        :src="book.coverImageUrl || '/placeholder-book.jpg'"
                        :alt="book.title"
                        class="h-16 w-12 object-cover rounded"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ book.title }}</div>
                      <div class="text-sm text-gray-500">{{ book.author }}</div>
                      <div v-if="book.isbn" class="text-xs text-gray-400">ISBN: {{ book.isbn }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {{ book.category?.name }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ book.availableCopies }}/{{ book.totalCopies }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ book.isActive ? 'Hoạt động' : 'Không hoạt động' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <BaseButton @click="editBook(book)" variant="outline" size="sm">
                    Sửa
                  </BaseButton>
                  <BaseButton @click="deleteBook(book)" variant="danger" size="sm">
                    Xóa
                  </BaseButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="booksStore.pagination.totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            :disabled="!booksStore.pagination.hasPrevPage"
            @click="changePage(booksStore.pagination.prevPage)"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          
          <span class="px-3 py-2 text-sm text-gray-700">
            Trang {{ booksStore.pagination.currentPage }} / {{ booksStore.pagination.totalPages }}
          </span>
          
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

    <!-- Create/Edit Book Modal -->
    <BookModal
      v-if="showCreateModal || showEditModal"
      :book="selectedBook"
      :is-edit="showEditModal"
      @save="handleSaveBook"
      @cancel="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBooksStore } from '@/stores/books';
import { debounce } from '@/utils/formatters';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BookModal from '@/components/admin/BookModal.vue';
import type { Book } from '@/types';

const booksStore = useBooksStore();

const filters = ref({
  search: '',
  category: '',
  available: '',
  page: 1,
  limit: 10
});

const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedBook = ref<Book | null>(null);

const debouncedSearch = debounce(() => {
  handleFilterChange();
}, 500);

const handleFilterChange = () => {
  filters.value.page = 1;
  fetchBooks();
};

const changePage = (page: number | null) => {
  if (page) {
    filters.value.page = page;
    fetchBooks();
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

const editBook = (book: Book) => {
  selectedBook.value = book;
  showEditModal.value = true;
};

const deleteBook = async (book: Book) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
    try {
      await booksStore.deleteBook(book._id);
      alert('Xóa sách thành công!');
    } catch (error: any) {
      alert(error.message || 'Có lỗi xảy ra khi xóa sách');
    }
  }
};

const handleSaveBook = async (bookData: any) => {
  try {
    if (showEditModal.value && selectedBook.value) {
      await booksStore.updateBook(selectedBook.value._id, bookData);
      alert('Cập nhật sách thành công!');
    } else {
      await booksStore.createBook(bookData);
      alert('Thêm sách thành công!');
    }
    closeModal();
  } catch (error: any) {
    alert(error.message || 'Có lỗi xảy ra khi lưu sách');
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedBook.value = null;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-book.jpg';
};

onMounted(async () => {
  await booksStore.fetchCategories();
  await fetchBooks();
});
</script>
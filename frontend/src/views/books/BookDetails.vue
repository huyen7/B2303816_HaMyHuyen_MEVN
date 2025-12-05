<template>
  <div>
    <AppHeader />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="booksStore.isLoading" class="animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-gray-300 h-96 rounded-lg"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-300 rounded"></div>
            <div class="h-6 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded"></div>
            <div class="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="booksStore.currentBook" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Book Image -->
        <div class="flex justify-center">
          <img
            :src="booksStore.currentBook.coverImageUrl || '/placeholder-book.jpg'"
            :alt="booksStore.currentBook.title"
            class="w-full max-w-md h-auto rounded-lg shadow-lg"
            @error="handleImageError"
          />
        </div>
        
        <!-- Book Details -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ booksStore.currentBook.title }}
            </h1>
            <p class="text-xl text-gray-600 mb-4">
              {{ booksStore.currentBook.author }}
            </p>
            
            <div class="flex items-center space-x-4 mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {{ booksStore.currentBook.category?.name }}
              </span>
              
              <div class="flex items-center">
                <div
                  :class="[
                    'w-3 h-3 rounded-full mr-2',
                    booksStore.currentBook.availableCopies > 0 ? 'bg-green-400' : 'bg-red-400'
                  ]"
                ></div>
                <span
                  :class="[
                    'text-sm font-medium',
                    booksStore.currentBook.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                  ]"
                >
                  {{ booksStore.currentBook.availableCopies > 0 ? 'Có sẵn' : 'Hết sách' }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Book Info -->
          <div class="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
            <div>
              <dt class="text-sm font-medium text-gray-500">ISBN</dt>
              <dd class="text-sm text-gray-900">{{ booksStore.currentBook.isbn || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Năm xuất bản</dt>
              <dd class="text-sm text-gray-900">{{ booksStore.currentBook.publishedYear || 'N/A' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Tổng số bản</dt>
              <dd class="text-sm text-gray-900">{{ booksStore.currentBook.totalCopies }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Có sẵn</dt>
              <dd class="text-sm text-gray-900">{{ booksStore.currentBook.availableCopies }}</dd>
            </div>
          </div>
          
          <!-- Description -->
          <div v-if="booksStore.currentBook.description">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Mô tả</h3>
            <p class="text-gray-700 leading-relaxed">
              {{ booksStore.currentBook.description }}
            </p>
          </div>
          
          <!-- Tags -->
          <div v-if="booksStore.currentBook.tags && booksStore.currentBook.tags.length > 0">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Thẻ</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in booksStore.currentBook.tags"
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <BaseButton
              v-if="authStore.isAuthenticated && booksStore.currentBook.availableCopies > 0"
              @click="handleBorrowRequest"
              :loading="borrowingStore.isLoading"
              :disabled="!canBorrow"
              variant="primary"
              size="lg"
            >
              {{ borrowButtonText }}
            </BaseButton>
            
            <router-link v-if="!authStore.isAuthenticated" to="/login">
              <BaseButton variant="primary" size="lg">
                Đăng nhập để mượn sách
              </BaseButton>
            </router-link>
            
            <router-link to="/books">
              <BaseButton variant="outline" size="lg">
                Quay lại danh mục
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sách</h2>
        <p class="text-gray-600 mb-8">Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <router-link to="/books">
          <BaseButton variant="primary">
            Quay lại danh mục
          </BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useBooksStore } from '@/stores/books';
import { useBorrowingStore } from '@/stores/borrowing';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const booksStore = useBooksStore();
const borrowingStore = useBorrowingStore();

const bookId = route.params.id as string;

const canBorrow = computed(() => {
  return authStore.isAuthenticated && 
         booksStore.currentBook?.availableCopies > 0 &&
         !borrowingStore.isLoading;
});

const borrowButtonText = computed(() => {
  if (borrowingStore.isLoading) return 'Đang xử lý...';
  if (!booksStore.currentBook?.availableCopies) return 'Hết sách';
  return 'Yêu cầu mượn sách';
});

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-book.jpg';
};

const handleBorrowRequest = async () => {
  if (!canBorrow.value) return;
  
  try {
    await borrowingStore.createBorrowingRequest(bookId);
    
    // Show success message and redirect
    alert('Yêu cầu mượn sách đã được gửi thành công! Vui lòng chờ admin phê duyệt.');
    router.push('/dashboard');
  } catch (error: any) {
    alert(error.message || 'Có lỗi xảy ra khi gửi yêu cầu mượn sách');
  }
};

onMounted(async () => {
  try {
    await booksStore.fetchBookById(bookId);
  } catch (error) {
    console.error('Error fetching book details:', error);
  }
});
</script>
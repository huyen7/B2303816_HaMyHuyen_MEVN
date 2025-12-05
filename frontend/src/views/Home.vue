<template>
  <div>
    <AppHeader />
    
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-2xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 transition duration-500 ease-out transform">
        <div class="text-center">
          <h1 class="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight animate-fade-in-down">
            Thư viện Không Giới Hạn, Ngay Tại Tay Bạn
          </h1>
          <p class="text-xl md:text-2xl mb-10 text-primary-100 animate-fade-in delay-200">
            Dễ dàng quản lý, mượn và trả hàng ngàn tựa sách yêu thích chỉ bằng vài cú nhấp chuột.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-500">
            
            <router-link to="/books">
              <BaseButton variant="secondary" size="lg" class="shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-0.5">
                Khám phá sách
              </BaseButton>
            </router-link>
            
            <router-link v-if="!authStore.isAuthenticated" to="/register">
              <BaseButton variant="outline" size="lg" class="hover:bg-primary-700/20 transition duration-300">
                Tạo Tài khoản Miễn phí
              </BaseButton>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <p class="text-sm font-semibold uppercase text-primary-600 mb-2 tracking-wider">LỢI ÍCH</p>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
            Đọc Sách Chưa Bao Giờ Dễ Dàng Đến Vậy
          </h2>
          <p class="mt-3 text-lg text-gray-600">
            Tiết kiệm thời gian di chuyển, tối đa hóa thời gian đọc sách của bạn.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div class="text-center p-6 bg-white rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.03] hover:shadow-xl">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Thư viện phong phú</h3>
            <p class="text-gray-600">Thư viện liên tục cập nhật với những tựa sách mới và bán chạy nhất.</p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.03] hover:shadow-xl">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Mượn sách nhanh chóng</h3>
            <p class="text-gray-600">Thao tác đơn giản: Yêu cầu, duyệt, và mượn sách chỉ trong 60 giây.</p>
          </div>
          
          <div class="text-center p-6 bg-white rounded-xl shadow-lg transition duration-300 transform hover:scale-[1.03] hover:shadow-xl">
            <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Quản lý hiệu quả</h3>
            <p class="text-gray-600">Nhắc nhở tự động về ngày đến hạn, giúp bạn tránh mọi chi phí phát sinh.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Sách phổ biến</h2>
          <router-link to="/books" class="text-primary-600 hover:text-primary-700 font-semibold transition duration-150 transform hover:translate-x-1">
            Xem tất cả →
          </router-link>
        </div>
        
        <div v-if="booksStore.isLoading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="i in 4" :key="i" class="p-4 rounded-xl shadow-lg bg-gray-100 animate-pulse transition duration-300">
            <div class="bg-gray-300 h-40 sm:h-64 rounded-lg mb-4"></div>
            <div class="h-6 bg-gray-300 rounded mb-3"></div>
            <div class="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
        
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          <BookCard
            v-for="book in popularBooks"
            :key="book._id" 
            :book="book"
          />
        </div>
      </div>
    </section>

    <section class="bg-primary-600 text-white py-16 shadow-inner">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Bước Đầu Tiên Tới Tủ Sách Cá Nhân Của Bạn
        </h2>
        <p class="text-xl mb-8 text-primary-100">
          Bắt đầu ngay bây giờ để mượn cuốn sách đầu tiên của bạn miễn phí!
        </p>
        
        <router-link v-if="!authStore.isAuthenticated" to="/register">
          <BaseButton 
            variant="secondary" 
            size="lg"
            class="shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.05]"
          >
            Mượn Sách Ngay Lập Tức
          </BaseButton>
        </router-link>
        <router-link v-else to="/books">
          <BaseButton 
            variant="secondary" 
            size="lg"
            class="shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.05]"
          >
            Khám phá thư viện
          </BaseButton>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useBooksStore } from '@/stores/books';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BookCard from '@/components/books/BookCard.vue';

const authStore = useAuthStore();
const booksStore = useBooksStore();

const popularBooks = ref([]);

onMounted(async () => {
  try {
    // Fetch popular books (first 4 books)
    await booksStore.fetchBooks({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
    popularBooks.value = booksStore.books as any;
  } catch (error) {
    console.error('Error fetching popular books:', error);
  }
});
</script>
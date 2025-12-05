<template>
  <div class="bg-white rounded-xl overflow-hidden shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.03] hover:shadow-2xl">
    <div class="aspect-w-3 aspect-h-4">
      <img
        :src="book.coverImageUrl || '/placeholder-book.jpg'"
        :alt="book.title"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      />
    </div>
    
    <div class="p-4">
      <h3 class="font-extrabold text-gray-900 mb-1 line-clamp-2 text-lg hover:text-indigo-600 transition duration-150">
        {{ book.title }}
      </h3>
      
      <p class="text-sm text-gray-600 mb-2">
        {{ book.author }}
      </p>
      
      <div class="flex items-center justify-between mb-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {{ book.category?.name }}
        </span>
        
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {{ book.availableCopies }}/{{ book.totalCopies }}
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div
            :class="[
              'w-2 h-2 rounded-full mr-2',
              book.availableCopies > 0 ? 'bg-green-400' : 'bg-red-400'
            ]"
          ></div>
          <span
            :class="[
              'text-xs font-medium',
              book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ book.availableCopies > 0 ? 'Có sẵn' : 'Hết sách' }}
          </span>
        </div>
        
        <router-link :to="`/books/${book._id}`">
          <BaseButton variant="outline" size="sm">
            Chi tiết
          </BaseButton>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Book } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';

interface Props {
  book: Book;
}

defineProps<Props>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-book.jpg';
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-w-3 {
  position: relative;
  width: 100%;
}

.aspect-h-4 {
  padding-bottom: 133.333333%; /* 4:3 aspect ratio */
}

.aspect-w-3 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
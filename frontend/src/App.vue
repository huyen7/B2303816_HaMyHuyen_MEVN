<template>
  <div id="app" class="min-h-screen bg-gray-50 antialiased text-gray-800">
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    </div>
</template>

<script setup lang="ts">
// Import các component toàn cục nếu có
// import ToastContainer from '@/components/common/ToastContainer.vue';

// App component - root component
</script>

<style>
/* Thêm hiệu ứng CSS cho transition 'fade'
Hiệu ứng chuyển trang mượt mà là yếu tố quan trọng tạo nên sự chuyên nghiệp
*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tùy chỉnh input focus toàn cục (Tùy chọn) */
.input,
textarea,
select {
  /* Áp dụng các style focus đã được tối ưu hóa trước đó */
  @apply block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out;
  @apply focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
}
</style>
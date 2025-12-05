<template>
  <div>
    <AppHeader /> 
    
    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-xl w-full text-center space-y-10">
        
        <div>
          <h1 class="text-[10rem] sm:text-[12rem] font-extrabold text-primary-600 leading-none tracking-tight transition duration-300 hover:scale-105">
            404
          </h1>
          
          <h2 class="mt-4 text-4xl font-bold text-gray-900 tracking-tight">
            ❌ Không tìm thấy trang
          </h2>
          
          <p class="mt-4 text-lg text-gray-600">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên, hoặc đường dẫn không hợp lệ. Vui lòng kiểm tra lại.
          </p>
        </div>
        
        <div class="mt-10 space-y-4 max-w-sm mx-auto">
          <router-link to="/">
            <BaseButton variant="primary" size="lg" full-width class="shadow-md hover:shadow-lg">
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                Về trang chủ
              </span>
            </BaseButton>
          </router-link>
          
          <router-link to="/books">
            <BaseButton variant="outline" size="lg" full-width>
              <span class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                Khám phá sách
              </span>
            </BaseButton>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
</script>
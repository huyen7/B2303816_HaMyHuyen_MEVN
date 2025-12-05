<template>
  <header class="bg-white shadow-lg border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center transition hover:scale-[1.02] duration-150">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-extrabold text-indigo-600">📚 BookLibrary</h1>
            </div>
          </router-link>
          
          <nav class="hidden md:ml-8 md:flex md:space-x-8">
            <router-link
              to="/"
              class="text-gray-500 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              :class="{ 'text-indigo-600 font-bold bg-gray-50': $route.name === 'Home' }"
            >
              Trang chủ
            </router-link>
            
            <router-link
              to="/books"
              class="text-gray-500 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              :class="{ 'text-indigo-600 font-bold bg-gray-50': $route.name === 'BookCatalog' }"
            >
              Danh mục sách
            </router-link>
            
            <router-link
              v-if="authStore.isAuthenticated"
              to="/dashboard"
              class="text-gray-500 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              :class="{ 'text-indigo-600 font-bold bg-gray-50': $route.name === 'UserDashboard' }"
            >
              Dashboard
            </router-link>
            
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              class="text-gray-500 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              :class="{ 'text-indigo-600 font-bold bg-gray-50': $route.name?.toString().startsWith('Admin') }"
            >
              Quản trị
            </router-link>
          </nav>
        </div>
        
        <div class="flex items-center space-x-4">
          <div v-if="!authStore.isAuthenticated" class="flex items-center space-x-2">
            <router-link to="/login">
              <BaseButton variant="outline" size="sm">
                Đăng nhập
              </BaseButton>
            </router-link>
            
            <router-link to="/register">
              <BaseButton variant="primary" size="sm">
                Đăng ký
              </BaseButton>
            </router-link>
          </div>
          
          <div v-else class="relative">
            <button
              @click="showUserMenu = !showUserMenu"
              class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out hover:bg-gray-50 p-1"
            >
              <div class="flex items-center space-x-2">
                <div class="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <span class="text-white text-md font-bold">
                    {{ userInitials }}
                  </span>
                </div>
                <span class="hidden md:block text-gray-700 font-semibold">{{ authStore.user?.fullName || authStore.user?.firstName }}</span>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </button>
            
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 origin-top-right transition ease-out duration-150 transform scale-100"
              @click="showUserMenu = false"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
              >
                Hồ sơ cá nhân
              </router-link>
              
              <router-link
                to="/borrowing-history"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
              >
                Lịch sử mượn sách
              </router-link>
              
              <div class="border-t border-gray-100 my-1"></div>
              
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
          
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <router-link
            to="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition"
            @click="showMobileMenu = false"
          >
            Trang chủ
          </router-link>
          
          <router-link
            to="/books"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition"
            @click="showMobileMenu = false"
          >
            Danh mục sách
          </router-link>
          
          <router-link
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition"
            @click="showMobileMenu = false"
          >
            Dashboard
          </router-link>
          
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 transition"
            @click="showMobileMenu = false"
          >
            Quản trị
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseButton from '@/components/common/BaseButton.vue';

const router = useRouter();
const authStore = useAuthStore();

const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const userInitials = computed(() => {
  if (!authStore.user) return '';
  const firstName = authStore.user.firstName || '';
  const lastName = authStore.user.lastName || '';
  
  if (firstName && lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
  // Trường hợp chỉ có fullName hoặc firstName
  const nameToUse = authStore.user.fullName || authStore.user.firstName || '';
  const parts = nameToUse.trim().split(/\s+/);
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return nameToUse.substring(0, 2).toUpperCase() || 'U'; 
});

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Logic đóng menu khi click outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element;

  // Dùng `closest` để kiểm tra phần tử chứa
  const isInsideUserMenu = target.closest('.relative') && target.closest('.relative')!.contains(target);
  const isMobileButton = target.closest('button.md\\:hidden');

  if (!isInsideUserMenu) {
    showUserMenu.value = false;
  }
  
  // Chỉ đóng mobile menu khi click vào nút mobile (hoặc click vào link bên trong)
  // và không đóng khi click vào bất cứ đâu bên ngoài nút
  if (showMobileMenu.value && !isMobileButton) {
      // Logic này hơi phức tạp, giữ nguyên logic click trong template để đóng menu khi chọn link
      // và chỉ đảm bảo menu người dùng đóng chính xác.
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
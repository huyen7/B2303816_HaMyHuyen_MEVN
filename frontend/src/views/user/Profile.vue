<template>
  <div>
    <AppHeader />
    
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h1>
        <p class="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div class="space-y-8">
        <!-- Profile Information -->
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Thông tin cá nhân</h2>
          </div>
          
          <form @submit.prevent="handleUpdateProfile" class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                id="firstName"
                v-model="form.firstName"
                label="Họ"
                placeholder="Nhập họ"
                required
                :error="errors.firstName"
              />
              
              <BaseInput
                id="lastName"
                v-model="form.lastName"
                label="Tên"
                placeholder="Nhập tên"
                required
                :error="errors.lastName"
              />
            </div>
            
            <BaseInput
              id="email"
              v-model="form.email"
              type="email"
              label="Email"
              placeholder="Nhập email"
              required
              :error="errors.email"
            />
            
            <div v-if="errors.general" class="text-sm text-red-600">
              {{ errors.general }}
            </div>
            
            <div class="flex justify-end">
              <BaseButton
                type="submit"
                :loading="authStore.isLoading"
                :disabled="!hasChanges"
              >
                Cập nhật thông tin
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Account Statistics -->
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Thống kê tài khoản</h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600">{{ userStats.totalRequests }}</div>
                <div class="text-sm text-gray-500">Tổng yêu cầu</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ userStats.returned }}</div>
                <div class="text-sm text-gray-500">Đã trả</div>
              </div>
              
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">{{ userStats.overdue }}</div>
                <div class="text-sm text-gray-500">Quá hạn</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="card">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Thông tin tài khoản</h2>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <dt class="text-sm font-medium text-gray-500">Vai trò</dt>
                <dd class="text-sm text-gray-900 capitalize">{{ authStore.user?.role }}</dd>
              </div>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  authStore.user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                ]"
              >
                {{ authStore.user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}
              </span>
            </div>
            
            <div class="flex justify-between items-center py-3 border-b border-gray-200">
              <div>
                <dt class="text-sm font-medium text-gray-500">Trạng thái email</dt>
                <dd class="text-sm text-gray-900">
                  {{ authStore.user?.isEmailVerified ? 'Đã xác minh' : 'Chưa xác minh' }}
                </dd>
              </div>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  authStore.user?.isEmailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ authStore.user?.isEmailVerified ? 'Đã xác minh' : 'Chưa xác minh' }}
              </span>
            </div>
            
            <div class="flex justify-between items-center py-3">
              <div>
                <dt class="text-sm font-medium text-gray-500">Ngày tham gia</dt>
                <dd class="text-sm text-gray-900">{{ formatDate(authStore.user?.createdAt || '') }}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import AppHeader from '@/components/layout/AppHeader.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { formatDate, isValidEmail } from '@/utils/formatters';

const authStore = useAuthStore();

const form = ref({
  firstName: '',
  lastName: '',
  email: ''
});

const originalForm = ref({
  firstName: '',
  lastName: '',
  email: ''
});

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  general: ''
});

const userStats = ref({
  totalRequests: 0,
  returned: 0,
  overdue: 0
});

const hasChanges = computed(() => {
  return form.value.firstName !== originalForm.value.firstName ||
         form.value.lastName !== originalForm.value.lastName ||
         form.value.email !== originalForm.value.email;
});

const validateForm = () => {
  errors.value = { firstName: '', lastName: '', email: '', general: '' };
  
  if (!form.value.firstName.trim()) {
    errors.value.firstName = 'Họ là bắt buộc';
  } else if (form.value.firstName.length < 2) {
    errors.value.firstName = 'Họ phải có ít nhất 2 ký tự';
  }
  
  if (!form.value.lastName.trim()) {
    errors.value.lastName = 'Tên là bắt buộc';
  } else if (form.value.lastName.length < 2) {
    errors.value.lastName = 'Tên phải có ít nhất 2 ký tự';
  }
  
  if (!form.value.email.trim()) {
    errors.value.email = 'Email là bắt buộc';
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Email không hợp lệ';
  }
  
  return !errors.value.firstName && !errors.value.lastName && !errors.value.email;
};

const handleUpdateProfile = async () => {
  if (!validateForm()) return;
  
  try {
    await authStore.updateProfile({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email
    });
    
    // Update original form values
    originalForm.value = { ...form.value };
    
    alert('Cập nhật thông tin thành công!');
  } catch (error: any) {
    errors.value.general = error.message || 'Có lỗi xảy ra khi cập nhật thông tin';
  }
};

const initializeForm = () => {
  if (authStore.user) {
    form.value = {
      firstName: authStore.user.firstName,
      lastName: authStore.user.lastName,
      email: authStore.user.email
    };
    originalForm.value = { ...form.value };
    
    // Set user stats if available
    if (authStore.user.borrowingStats) {
      userStats.value = {
        totalRequests: authStore.user.borrowingStats.totalRequests,
        returned: authStore.user.borrowingStats.returned,
        overdue: authStore.user.borrowingStats.overdue
      };
    }
  }
};

onMounted(() => {
  initializeForm();
});
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            tạo tài khoản mới
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="card p-6">
          <BaseInput
            id="email"
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="Nhập email của bạn"
            required
            :error="errors.email"
          />
          
          <BaseInput
            id="password"
            v-model="form.password"
            type="password"
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            required
            :error="errors.password"
          />
          
          <div v-if="errors.general" class="mb-4">
            <p class="text-sm text-red-600">{{ errors.general }}</p>
          </div>
          
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="authStore.isLoading"
            :disabled="!isFormValid"
            full-width
          >
            Đăng nhập
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { isValidEmail } from '@/utils/formatters';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: '',
  password: '',
  general: ''
});

const isFormValid = computed(() => {
  return form.value.email && 
         form.value.password && 
         !errors.value.email && 
         !errors.value.password;
});

const validateForm = () => {
  errors.value = { email: '', password: '', general: '' };
  
  if (!form.value.email) {
    errors.value.email = 'Email là bắt buộc';
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Email không hợp lệ';
  }
  
  if (!form.value.password) {
    errors.value.password = 'Mật khẩu là bắt buộc';
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  return isFormValid.value;
};

const handleLogin = async () => {
  if (!validateForm()) return;
  
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    });
    
    // Redirect to intended page or dashboard
    const redirectTo = route.query.redirect as string || '/dashboard';
    router.push(redirectTo);
  } catch (error: any) {
    errors.value.general = error.message || 'Đăng nhập thất bại';
  }
};

onMounted(() => {
  // Clear any existing errors when component mounts
  errors.value = { email: '', password: '', general: '' };
});
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            đăng nhập vào tài khoản có sẵn
          </router-link>
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="card p-6">
          <div class="grid grid-cols-2 gap-4">
            <BaseInput
              id="firstName"
              v-model="form.firstName"
              type="text"
              label="Họ"
              placeholder="Nhập họ"
              required
              :error="errors.firstName"
            />
            
            <BaseInput
              id="lastName"
              v-model="form.lastName"
              type="text"
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
            hint="Mật khẩu phải có ít nhất 6 ký tự"
          />
          
          <BaseInput
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            required
            :error="errors.confirmPassword"
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
            Đăng ký
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { isValidEmail } from '@/utils/formatters';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  general: ''
});

const isFormValid = computed(() => {
  return form.value.firstName && 
         form.value.lastName && 
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword &&
         !errors.value.firstName &&
         !errors.value.lastName &&
         !errors.value.email &&
         !errors.value.password &&
         !errors.value.confirmPassword;
});

const validateForm = () => {
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  };
  
  if (!form.value.firstName) {
    errors.value.firstName = 'Họ là bắt buộc';
  } else if (form.value.firstName.length < 2) {
    errors.value.firstName = 'Họ phải có ít nhất 2 ký tự';
  }
  
  if (!form.value.lastName) {
    errors.value.lastName = 'Tên là bắt buộc';
  } else if (form.value.lastName.length < 2) {
    errors.value.lastName = 'Tên phải có ít nhất 2 ký tự';
  }
  
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
  
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }
  
  return isFormValid.value;
};

const handleRegister = async () => {
  if (!validateForm()) return;
  
  try {
    await authStore.register({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword
    });
    
    // Redirect to dashboard after successful registration
    router.push('/dashboard');
  } catch (error: any) {
    errors.value.general = error.message || 'Đăng ký thất bại';
  }
};

onMounted(() => {
  // Clear any existing errors when component mounts
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: ''
  };
});
</script>
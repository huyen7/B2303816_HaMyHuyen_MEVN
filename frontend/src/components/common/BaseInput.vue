<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="id"
        :type="computedType" 
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="inputClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      
      <div v-if="props.type === 'password'" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button
          type="button"
          @click="togglePasswordVisibility"
          class="text-gray-400 hover:text-indigo-600 focus:outline-none transition duration-150"
          :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
        >
          <svg v-if="showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-600 font-medium">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  id?: string;
  label?: string;
  type?: string; // Giữ nguyên prop type là string
  modelValue: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  blur: [];
  focus: [];
}>();

const showPassword = ref(false);

/**
 * Kiểu đầu vào thực tế được sử dụng trong thẻ <input>
 * Nếu props.type là 'password', nó sẽ được chuyển đổi giữa 'password' và 'text'
 */
const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

// Lớp CSS cho Input
const inputClasses = computed(() => [
  // Base Styling: Làm tròn góc, padding, và box-shadow nhẹ
  'block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out',
  
  // Focus State: Sử dụng màu Indigo làm màu nhấn
  'focus:ring-indigo-500 focus:border-indigo-500',
  
  // Padding Adjustment: Nếu có nút toggle password, cần thêm padding bên phải
  {
    'pr-10': props.type === 'password', 
  },
  
  // Error State: Ghi đè lên trạng thái focus/default
  {
    'border-red-500 focus:ring-red-500 focus:border-red-500 pr-10': props.error, // Tăng cường màu đỏ
    'bg-red-50 border-red-500': props.error, // Thêm nền đỏ nhạt khi có lỗi (tùy chọn)
  },
  
  // Disabled State
  {
    'bg-gray-50 opacity-70 cursor-not-allowed': props.disabled
  }
]);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>
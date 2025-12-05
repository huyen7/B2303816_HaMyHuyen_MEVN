<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
});

const emit = defineEmits<{
  click: [];
}>();

const buttonClasses = computed(() => {
  // 1. Base Classes (Chung cho tất cả các nút)
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // 2. Variant Classes (Màu sắc) - Đảm bảo đồng bộ với Indigo
  let variantClasses = '';
  switch (props.variant) {
    case 'primary':
      // Dùng Indigo làm màu chính
      variantClasses = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 border border-transparent';
      break;
    case 'secondary':
      // Dùng màu xám nhạt làm màu phụ
      variantClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 border border-transparent';
      break;
    case 'danger':
      // Dùng màu đỏ cho hành động nguy hiểm
      variantClasses = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent';
      break;
    case 'outline':
      // Dùng viền Indigo (hoặc Gray tùy thích, nhưng Indigo nổi bật hơn)
      variantClasses = 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-500 focus:ring-indigo-500';
      break;
  }
  
  // 3. Size Classes (Kích thước)
  let sizeClasses = '';
  switch (props.size) {
    case 'sm':
      sizeClasses = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      // Chỉnh sửa size md sang text-sm để đồng bộ với Header
      sizeClasses = 'px-4 py-2 text-sm'; 
      break;
    case 'lg':
      sizeClasses = 'px-6 py-3 text-base';
      break;
  }

  // 4. State Classes (Trạng thái)
  const stateClasses = {
    'opacity-50 cursor-not-allowed': props.disabled || props.loading,
    'w-full': props.fullWidth,
  };

  // 5. Kết hợp tất cả
  return [
    baseClasses,
    variantClasses,
    sizeClasses,
    stateClasses
  ];
});
</script>
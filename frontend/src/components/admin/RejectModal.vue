<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
    <div 
      class="relative top-20 mx-auto p-6 border w-[400px] sm:w-[500px] shadow-2xl rounded-xl bg-white transition-all duration-300 transform scale-100 opacity-100"
      @click.stop
    >
      <div class="mt-2">
        <h3 class="text-xl font-bold text-indigo-700 mb-5 border-b border-gray-100 pb-2">
          ❌ Từ chối yêu cầu mượn sách
        </h3>
        
        <div class="mb-5 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg shadow-sm">
          <p class="text-sm font-bold text-gray-900">Sách: {{ borrowing?.book.title }}</p>
          <p class="text-sm text-gray-600">Người yêu cầu: {{ borrowing?.user.firstName }} {{ borrowing?.user.lastName }}</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Lý do từ chối <span class="text-red-600">*</span>
            </label>
            
            <textarea
              v-model="adminNotes"
              rows="4"
              placeholder="Nhập lý do từ chối yêu cầu..."
              required
              class="block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out focus:ring-indigo-500 focus:border-indigo-500"
              :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50': error }"
            ></textarea>
            
            <p v-if="error" class="mt-1 text-sm font-medium text-red-600">{{ error }}</p>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <BaseButton
              type="button"
              @click="$emit('cancel')"
              variant="outline"
              class="shadow-sm"
            >
              Hủy
            </BaseButton>
            
            <BaseButton
              type="submit"
              variant="danger"
              :loading="isLoading"
              :disabled="!adminNotes.trim() || isLoading || error !== ''"
              class="shadow-md"
            >
              Từ chối
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BorrowingRequest } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';

interface Props {
  borrowing: BorrowingRequest | null;
}

defineProps<Props>();

const emit = defineEmits<{
  reject: [adminNotes: string];
  cancel: [];
}>();

const adminNotes = ref('');
const error = ref('');
const isLoading = ref(false);
const MIN_LENGTH = 10;

// Hàm kiểm tra và cập nhật lỗi
const validateNotes = (value: string) => {
  if (!value.trim()) {
    error.value = 'Vui lòng nhập lý do từ chối';
  } else if (value.trim().length < MIN_LENGTH) {
    error.value = `Lý do từ chối phải có ít nhất ${MIN_LENGTH} ký tự`;
  } else {
    error.value = '';
  }
};

// Theo dõi thay đổi của textarea để hiển thị lỗi ngay lập tức
watch(adminNotes, (newValue) => {
  validateNotes(newValue);
});

const handleSubmit = async () => {
  validateNotes(adminNotes.value);
  
  // Chỉ tiếp tục nếu không có lỗi
  if (error.value) {
    return;
  }
  
  isLoading.value = true;
  
  try {
    emit('reject', adminNotes.value.trim());
    // Không cần reset adminNotes/error/isLoading ở đây, 
    // vì modal sẽ bị đóng sau khi emit.
  } catch (e) {
    // Xử lý lỗi nếu có logic reject tại component cha
    console.error('Rejection failed:', e);
    error.value = 'Đã xảy ra lỗi khi gửi yêu cầu từ chối.';
  } finally {
    isLoading.value = false;
  }
};
</script>
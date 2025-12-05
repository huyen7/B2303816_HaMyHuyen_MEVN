<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
    <div 
      class="relative top-20 mx-auto p-6 border w-[400px] sm:w-[500px] shadow-2xl rounded-xl bg-white transition-all duration-300 transform scale-100 opacity-100"
      @click.stop
    >
      <div class="mt-2">
        <h3 class="text-xl font-bold text-indigo-700 mb-5 border-b border-gray-100 pb-2">
          ✅ Phê duyệt yêu cầu mượn sách
        </h3>
        
        <div class="mb-5 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg shadow-sm">
          <p class="text-sm font-bold text-gray-900">Sách: {{ borrowing?.book.title }}</p>
          <p class="text-sm text-gray-600">Người yêu cầu: {{ borrowing?.user.firstName }} {{ borrowing?.user.lastName }}</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Thời gian mượn (ngày)
            </label>
            <select 
              v-model.number="form.borrowingPeriodDays" 
              class="block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option :value="7">7 ngày</option>
              <option :value="14">14 ngày</option>
              <option :value="21">21 ngày</option>
              <option :value="30">30 ngày</option>
            </select>
            </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              v-model="form.adminNotes"
              rows="3"
              class="block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập ghi chú cho người dùng..."
            ></textarea>
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
              variant="primary"
              :loading="isLoading"
              class="shadow-md"
            >
              Phê duyệt
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { BorrowingRequest } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';

interface Props {
  borrowing: BorrowingRequest | null;
}

defineProps<Props>();

const emit = defineEmits<{
  // Đảm bảo kiểu number cho borrowingPeriodDays
  approve: [data: { borrowingPeriodDays: number; adminNotes?: string }];
  cancel: [];
}>();

const form = ref({
  // Sử dụng giá trị number mặc định 14
  borrowingPeriodDays: 14 as number, 
  adminNotes: ''
});

const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  
  try {
    emit('approve', {
      // Đảm bảo gửi giá trị là number
      borrowingPeriodDays: form.value.borrowingPeriodDays,
      adminNotes: form.value.adminNotes || undefined
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:scale-[1.005] hover:shadow-lg mb-4">
    <div class="p-4 sm:p-6">
      <div class="flex items-start space-x-4">
        <div class="flex-shrink-0">
          <img
            :src="borrowing.book.coverImageUrl || '/placeholder-book.jpg'"
            :alt="borrowing.book.title"
            class="w-16 h-24 object-cover rounded-lg shadow-sm border border-gray-100"
            @error="handleImageError"
          />
        </div>
        
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 transition">
                {{ borrowing.book.title }}
              </h3>
              <p class="text-sm text-gray-500 italic">{{ borrowing.book.author }}</p>
              
              <div class="mt-3">
                <span
                  :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm',
                    getStatusColor(borrowing.status)
                  ]"
                >
                  <span class="mr-1 text-base leading-none">•</span> 
                  {{ getStatusText(borrowing.status) }}
                </span>
              </div>
              
              <div class="mt-3 text-sm text-gray-600 space-y-1.5">
                <div v-if="borrowing.requestDate">
                  <span class="font-medium text-gray-500">Yêu cầu:</span> {{ formatDate(borrowing.requestDate) }}
                </div>
                <div v-if="borrowing.approvalDate && borrowing.status !== 'pending'">
                  <span class="font-medium text-gray-500">Duyệt:</span> {{ formatDate(borrowing.approvalDate) }}
                </div>
                
                <div v-if="borrowing.dueDate" class="flex items-center font-bold">
                  <span class="font-medium text-gray-500">Hạn trả:</span> 
                  <span class="ml-1"> {{ formatDate(borrowing.dueDate) }}</span>

                  <span
                    v-if="isOverdue(borrowing.dueDate) && borrowing.status === 'approved'"
                    class="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-extrabold animate-pulse"
                  >
                    QUÁ HẠN ({{ Math.abs(getDaysUntilDue(borrowing.dueDate)) }} ngày)
                  </span>
                  <span
                    v-else-if="borrowing.status === 'approved'"
                    :class="[
                      'ml-2 px-2 py-0.5 rounded-full text-xs font-bold',
                      getDaysUntilDue(borrowing.dueDate) <= 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    ]"
                  >
                    Còn {{ getDaysUntilDue(borrowing.dueDate) }} ngày
                  </span>
                </div>
                
                <div v-if="borrowing.returnDate">
                  <span class="font-medium text-gray-500">Ngày trả:</span> {{ formatDate(borrowing.returnDate) }}
                </div>
              </div>
              
              <div v-if="borrowing.overdueFee && borrowing.overdueFee > 0" class="mt-3 p-2 bg-red-50 border-l-4 border-red-400 rounded-r">
                <p class="text-sm text-red-700 font-bold">
                  ⚠️ Phí quá hạn: {{ formatCurrency(borrowing.overdueFee) }}
                  <span v-if="!borrowing.overdueFeePaid" class="text-xs font-medium">(Chưa thanh toán)</span>
                  <span v-else class="text-xs text-green-700 font-medium">(Đã thanh toán)</span>
                </p>
              </div>
              
              <div v-if="borrowing.adminNotes" class="mt-3 p-2 bg-gray-50 rounded-md">
                <p class="text-xs text-gray-600">
                  <span class="font-bold text-indigo-600">Ghi chú từ QTV:</span> {{ borrowing.adminNotes }}
                </p>
              </div>
            </div>
            
            <div v-if="showActions && borrowing.status === 'approved'" class="flex-shrink-0 ml-4 self-center">
              <BaseButton
                @click="$emit('return', borrowing._id)"
                variant="primary"
                size="sm"
                class="shadow-lg hover:shadow-xl"
              >
                Trả sách
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BorrowingRequest } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';
import { formatDate, formatCurrency, getStatusText, getStatusColor, getDaysUntilDue, isOverdue } from '@/utils/formatters';

interface Props {
  borrowing: BorrowingRequest;
  showActions?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  return: [borrowingId: string];
}>();

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-book.jpg';
};
</script>
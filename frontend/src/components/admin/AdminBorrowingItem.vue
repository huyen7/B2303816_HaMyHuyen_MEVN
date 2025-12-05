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
              <h3 class="text-base font-bold text-gray-900 line-clamp-2 hover:text-indigo-600 transition duration-150">
                {{ borrowing.book.title }}
              </h3>
              <p class="text-sm text-gray-500 italic mb-2">{{ borrowing.book.author }}</p>
              
              <div class="mt-3 flex items-center space-x-3 p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                <div class="w-8 h-8 flex-shrink-0 bg-indigo-200 rounded-full flex items-center justify-center">
                  <span class="text-indigo-700 font-bold text-sm">
                    {{ getUserInitials(borrowing.user) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">
                    {{ borrowing.user.firstName }} {{ borrowing.user.lastName }}
                  </p>
                  <p class="text-xs text-indigo-600">{{ borrowing.user.email }}</p>
                </div>
              </div>
              
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
                <div>
                  <span class="font-medium text-gray-500">Yêu cầu:</span> 
                  <span class="font-semibold">{{ formatDate(borrowing.requestDate) }}</span>
                </div>
                
                <div v-if="borrowing.approvalDate">
                  <span class="font-medium text-gray-500">Duyệt:</span> {{ formatDate(borrowing.approvalDate) }}
                </div>
                <div v-if="borrowing.dueDate">
                  <span class="font-medium text-gray-500">Hạn trả:</span> 
                  <span 
                    :class="{'text-red-600 font-bold': isOverdue(borrowing.dueDate) && borrowing.status === 'approved'}"
                  >
                    {{ formatDate(borrowing.dueDate) }}
                  </span>
                </div>
                </div>
            </div>
            
            <div 
              v-if="borrowing.status === 'pending'" 
              class="flex-shrink-0 ml-4 pt-1 space-y-2 sm:space-y-0 sm:flex sm:flex-col sm:space-x-0"
            >
              <BaseButton
                @click="$emit('approve', borrowing)"
                variant="primary"
                size="sm"
                class="w-full sm:w-auto shadow-md hover:shadow-lg"
              >
                Phê duyệt
              </BaseButton>
              
              <BaseButton
                @click="$emit('reject', borrowing)"
                variant="danger"
                size="sm"
                class="w-full sm:w-auto shadow-sm hover:shadow-md"
              >
                Từ chối
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BorrowingRequest, User } from '@/types';
import BaseButton from '@/components/common/BaseButton.vue';
import { 
  formatDate, 
  formatCurrency, 
  getStatusText, 
  getStatusColor, 
  getDaysUntilDue, 
  isOverdue 
} from '@/utils/formatters';

interface Props {
  borrowing: BorrowingRequest;
}

defineProps<Props>();

const emit = defineEmits<{
  approve: [borrowing: BorrowingRequest];
  reject: [borrowing: BorrowingRequest];
}>();

const getUserInitials = (user: User): string => {
  // Logic này đã đúng
  return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/placeholder-book.jpg';
};
</script>
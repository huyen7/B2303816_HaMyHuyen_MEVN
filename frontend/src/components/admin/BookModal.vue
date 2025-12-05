<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 transition-opacity duration-300">
    <div 
      class="relative top-10 mx-auto p-6 border w-full max-w-3xl shadow-2xl rounded-xl bg-white transition-all duration-300 transform scale-100 opacity-100 mb-10"
      @click.stop
    >
      <div class="mt-2">
        <h3 class="text-xl font-bold text-indigo-700 mb-6 border-b border-gray-100 pb-2">
          {{ isEdit ? '✏️ Chỉnh sửa sách' : '📚 Thêm sách mới' }}
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.title"
              label="Tên sách"
              placeholder="Nhập tên sách"
              required
              :error="errors.title"
            />
            
            <BaseInput
              v-model="form.author"
              label="Tác giả"
              placeholder="Nhập tên tác giả"
              required
              :error="errors.author"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.isbn"
              label="ISBN"
              placeholder="Nhập mã ISBN"
              :error="errors.isbn"
            />
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Thể loại <span class="text-red-600">*</span>
              </label>
              <select
                v-model="form.category"
                required
                class="block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50': errors.category }"
              >
                <option value="">Chọn thể loại</option>
                <option
                  v-for="category in booksStore.categories"
                  :key="category._id"
                  :value="category._id"
                >
                  {{ category.name }}
                </option>
              </select>
              <p v-if="errors.category" class="mt-1 text-sm font-medium text-red-600">{{ errors.category }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="block w-full border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 py-2 px-3 transition duration-150 ease-in-out focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Nhập mô tả sách..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BaseInput
              v-model.number="form.totalCopies"
              type="number"
              label="Tổng số bản"
              placeholder="1"
              min="1"
              required
              :error="errors.totalCopies"
            />
            
            <BaseInput
              v-model.number="form.availableCopies"
              type="number"
              label="Số bản có sẵn"
              placeholder="1"
              min="0"
              :error="errors.availableCopies"
            />
            
            <BaseInput
              v-model.number="form.publishedYear"
              type="number"
              label="Năm xuất bản"
              placeholder="2024"
              :min="1000"
              :max="new Date().getFullYear()"
              :error="errors.publishedYear"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa</label>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition duration-150"
            />
            <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB. Chỉ cần chọn lại khi muốn thay đổi.</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Thẻ (phân cách bằng dấu phẩy)</label>
            <BaseInput
              v-model="tagsInput"
              placeholder="ví dụ: văn học, tiểu thuyết, việt nam"
            />
          </div>
          
          <div v-if="errors.general" class="p-3 bg-red-100 border border-red-400 text-sm text-red-700 rounded-lg font-medium">
            {{ errors.general }}
          </div>
          
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-100">
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
              :disabled="!isFormValid || isLoading"
              class="shadow-md hover:shadow-lg"
            >
              {{ isEdit ? 'Cập nhật' : 'Thêm sách' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useBooksStore } from '@/stores/books';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import { isValidISBN } from '@/utils/formatters';
import type { Book } from '@/types';

interface Props {
  book?: Book | null;
  isEdit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  book: null,
  isEdit: false
});

const emit = defineEmits<{
  save: [bookData: any];
  cancel: [];
}>();

const booksStore = useBooksStore();

const form = ref({
  title: '',
  author: '',
  isbn: '',
  description: '',
  category: '',
  totalCopies: 1,
  availableCopies: 1,
  publishedYear: new Date().getFullYear(),
  coverImage: null as File | null
});

const tagsInput = ref('');
const fileInput = ref<HTMLInputElement>();
const isLoading = ref(false);

const errors = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  totalCopies: '',
  availableCopies: '',
  publishedYear: '',
  general: ''
});

const isFormValid = computed(() => {
  return form.value.title &&
         form.value.author &&
         form.value.category &&
         form.value.totalCopies > 0 &&
         form.value.availableCopies >= 0 &&
         !errors.value.title &&
         !errors.value.author &&
         !errors.value.isbn &&
         !errors.value.category &&
         !errors.value.totalCopies &&
         !errors.value.availableCopies &&
         !errors.value.publishedYear;
});

const validateForm = () => {
  errors.value = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: '',
    availableCopies: '',
    publishedYear: '',
    general: ''
  };
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Tên sách là bắt buộc';
  }
  
  if (!form.value.author.trim()) {
    errors.value.author = 'Tác giả là bắt buộc';
  }
  
  if (form.value.isbn && !isValidISBN(form.value.isbn)) {
    errors.value.isbn = 'ISBN không hợp lệ';
  }
  
  if (!form.value.category) {
    errors.value.category = 'Thể loại là bắt buộc';
  }
  
  if (form.value.totalCopies < 1) {
    errors.value.totalCopies = 'Tổng số bản phải lớn hơn 0';
  }
  
  if (form.value.availableCopies < 0) {
    errors.value.availableCopies = 'Số bản có sẵn không thể âm';
  }
  
  if (form.value.availableCopies > form.value.totalCopies) {
    errors.value.availableCopies = 'Số bản có sẵn không thể lớn hơn tổng số bản';
  }
  
  if (form.value.publishedYear && (form.value.publishedYear < 1000 || form.value.publishedYear > new Date().getFullYear())) {
    errors.value.publishedYear = 'Năm xuất bản không hợp lệ';
  }
  
  return isFormValid.value;
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      target.value = '';
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh.');
      target.value = '';
      return;
    }
    
    form.value.coverImage = file;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  
  try {
    const bookData = {
      title: form.value.title.trim(),
      author: form.value.author.trim(),
      isbn: form.value.isbn.trim() || undefined,
      description: form.value.description.trim() || undefined,
      category: form.value.category,
      totalCopies: form.value.totalCopies,
      availableCopies: form.value.availableCopies,
      publishedYear: form.value.publishedYear || undefined,
      tags: tagsInput.value ? tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag) : undefined,
      coverImage: form.value.coverImage || undefined
    };
    
    emit('save', bookData);
  } catch (error: any) {
    errors.value.general = error.message || 'Có lỗi xảy ra';
  } finally {
    isLoading.value = false;
  }
};

// Watch for availableCopies changes to auto-adjust
watch(() => form.value.totalCopies, (newTotal) => {
  if (form.value.availableCopies > newTotal) {
    form.value.availableCopies = newTotal;
  }
});

onMounted(() => {
  if (props.isEdit && props.book) {
    form.value = {
      title: props.book.title,
      author: props.book.author,
      isbn: props.book.isbn || '',
      description: props.book.description || '',
      category: props.book.category._id,
      totalCopies: props.book.totalCopies,
      availableCopies: props.book.availableCopies,
      publishedYear: props.book.publishedYear || new Date().getFullYear(),
      coverImage: null
    };
    
    if (props.book.tags) {
      tagsInput.value = props.book.tags.join(', ');
    }
  }
});
</script>
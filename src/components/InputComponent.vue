<template>
  <div class="input-container">
    <!-- 普通輸入框 -->
    <input
      v-if="type !== 'date' && type !== 'file'"
      class="custom-input"
      :type="type"
      :placeholder="placeholder"
      v-model="model"
    />

    <!-- 日期輸入 -->
    <div v-else-if="type === 'date'" class="date-input-container">
      <input
        class="custom-input"
        type="text"
        :placeholder="placeholder"
        v-model="displayValue"
        readonly
        @click="openDatePicker"
      />
      <input
        ref="datePickerRef"
        type="date"
        class="hidden-input"
        :min="formatDateForInput(min)"
        v-model="internalValue"
        @change="handleDateChange"
      />
    </div>

    <!-- 檔案輸入 -->
    <div v-else-if="type === 'file'" class="file-input-container">
      <input
        ref="fileInputRef"
        type="file"
        class="hidden-input"
        accept="image/*"
        @change="handleFileChange"
      />
      <div class="file-placeholder" @click="triggerFileInput">
        {{ placeholder || '點擊上傳圖片' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineModel, watch } from 'vue'

  interface InputProps {
    type?: 'text' | 'date' | 'file'
    placeholder?: string
    min?: string
  }

  defineProps<InputProps>()

  // 雙向綁定
  const model = defineModel<string>()

  // 日期管理
  const internalValue = ref('')
  const displayValue = ref('')
  const datePickerRef = ref<HTMLInputElement | null>(null)

  // 檔案管理
  const fileInputRef = ref<HTMLInputElement | null>(null)

  // 打開日期選擇器
  const openDatePicker = () => datePickerRef.value?.showPicker()

  // 觸發檔案選擇
  const triggerFileInput = () => fileInputRef.value?.click()

  // 處理檔案變更
  const handleFileChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      model.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  // 處理日期變更
  const handleDateChange = () => {
    if (!internalValue.value) {
      displayValue.value = ''
      model.value = ''
      return
    }
    const formatted = internalValue.value.replace(/-/g, '/')
    displayValue.value = formatted
    model.value = formatted
  }

  // 監聽外部 model 變化
  watch(
    () => model.value,
    (val) => {
      if (!val) {
        internalValue.value = ''
        displayValue.value = ''
        return
      }
      console.log('110', val)

      // 日期格式同步
      if (val.includes('/')) {
        internalValue.value = val.replace(/\//g, '-')
        displayValue.value = val.replace(/-/g, '/')
      }
    },
    { immediate: true }
  )
  const formatDateForInput = (dateStr?: string): string => {
    if (!dateStr) return ''

    // 如果已經是 yyyy-mm-dd 格式，直接返回
    if (dateStr.includes('-')) return dateStr

    // 將 yyyy/mm/dd 轉換為 yyyy-mm-dd
    return dateStr.replace(/\//g, '-')
  }
</script>

<style scoped>
  .input-container {
    margin-bottom: 15px;
  }

  .custom-input {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: 16px;
    box-sizing: border-box;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .custom-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  .date-input-container {
    position: relative;
  }

  .hidden-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }

  .file-input-container {
    width: 100%;
  }

  .file-placeholder {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    background-color: #e7ffe9;
    text-align: center;
    color: #555;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .file-placeholder:hover {
    background-color: #d7f7d9;
  }
</style>

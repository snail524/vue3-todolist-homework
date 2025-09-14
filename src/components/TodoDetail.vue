<!-- TodoDetail.vue -->
<template>
  <div v-if="todoModel">
    <div class="mb-4">
      <div>
        <div class="flex items-center justify-between gap-2">
          <!-- 漢堡圖示 (手機才顯示) -->
          <div class="ham block md:hidden">
            <i
              class="fa-solid fa-bars text-xl cursor-pointer"
              @click="$emit('set-sidebar', true)"
            ></i>
          </div>

          <!-- 其他可擴展的中間內容 -->
          <div class="flex-1"></div>

          <!-- 垃圾桶圖示總在右邊 -->
          <img
            src="@/assets/trash.svg"
            alt="delete"
            class="w-6 h-6 cursor-pointer"
            @click="$emit('delete-todo', todoModel.id)"
          />
        </div>
      </div>
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1">Title</label>
          <InputComponent type="text" placeholder="請輸入文字" v-model="todoModel.title" />
        </div>
        <div class="w-1/2">
          <label class="block mb-1">Date</label>
          <div class="flex items-center relative">
            <InputComponent type="date" placeholder="日期" v-model="todoModel.startDate" />
            <span class="px-2 text-gray-500">~</span>
            <InputComponent
              type="date"
              placeholder="日期"
              v-model="todoModel.endDate"
              :min="todoModel.startDate"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block mb-1">Image</label>
      <div class="flex gap-4">
        <!-- 左側上傳區域 -->
        <div class="flex-1">
          <InputComponent type="file" placeholder="Upload Image" @change="handleFileUpload" />
          <div class="text-center text-gray-500 my-2">or</div>
          <InputComponent type="text" placeholder="請輸入圖片網址" v-model="todoModel.image" />
        </div>

        <!-- 右側預覽區域 -->
        <div class="flex-1 border rounded flex items-center justify-center bg-gray-50">
          <img
            v-if="todoModel.image"
            :src="todoModel.image"
            class="max-h-40 max-w-full object-contain"
          />
          <div v-else class="text-gray-400 text-center bg-[#EBEBEB]">
            <img :src="imgSample" class="max-h-40 max-w-full object-contain" />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block mb-1">Content</label>
      <TextAreaComponent v-model="todoModel.content" :rows="5"></TextAreaComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, defineModel, watch, onMounted } from 'vue'
  import InputComponent from './InputComponent.vue'
  import TextAreaComponent from './TextAreaComponent.vue'

  // 定義 Todo 類型
  interface Todo {
    id: number
    title: string
    content: string
    startDate: string
    endDate: string
    image: string
    // 其他可能的屬性
  }

  // 使用 defineModel 來創建雙向綁定
  const todoModel = defineModel<Todo | null>('currentTodo')

  defineProps<{
    imgSample: string
  }>()

  // 定義事件
  const emit = defineEmits<{
    (e: 'delete-todo', id: number): void
    (e: 'set-sidebar', value: boolean): void
  }>()

  // 修改文件上傳處理函數
  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0 && todoModel.value) {
      const file = target.files[0]
      // 創建一個 FileReader 來讀取文件
      const reader = new FileReader()

      reader.onload = (e) => {
        if (e.target?.result && todoModel.value) {
          // 直接更新 todoModel 的 image 屬性
          todoModel.value = {
            ...todoModel.value,
            image: e.target.result as string,
          }
        }
      }
      reader.readAsDataURL(file)
    }
  }
</script>

<style>
  .error {
    color: red;
    top: 2.5rem;
  }
</style>

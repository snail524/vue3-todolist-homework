<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  import ButtonComponent from './ButtonComponent.vue'
  import type { Todo, ImageState } from '../types/index.ts' // 從 index.ts 統一匯入

  // 定義 props
  defineProps<{
    todos: Todo[]
    selectedId: number | null
    imgSampleObj: ImageState // 這裡改為使用 ImageState 類型
  }>()

  // 定義事件
  const emit = defineEmits<{
    (e: 'select-todo', id: number): void
    (e: 'create-todo'): void
    (e: 'setSidebar', value: boolean): void
    (e: 'changeImg'): void
  }>()

  // 選擇 Todo 的方法
  const selectTodo = (id: number) => {
    emit('select-todo', id)
  }

  // 創建新 Todo 的方法
  const createTodo = () => {
    emit('create-todo')
  }
  const setSidebar = (boolean: boolean) => {
    emit('setSidebar', boolean)
  }
  const changeImg = () => {
    emit('changeImg')
  }
</script>

<template>
  <div class="bg-primary rounded flex flex-col h-full">
    <div class="flex justify-between items-center px-4 mb-4">
      <h2 class="text-xl font-bold text-center">Demo Todo List</h2>
      <div class="block md:hidden">
        <i class="fa-solid fa-x cursor-pointer" @click="setSidebar(false)"></i>
      </div>
    </div>
    <!-- Todo 列表 -->
    <div class="flex-grow overflow-y-auto">
      <ul class="mb-4">
        <li
          v-for="(todo, index) in todos"
          :key="todo.id"
          @click="selectTodo(todo.id)"
          class="p-2 mb-2 rounded flex cursor-pointer relative"
          :class="
            todo.id === selectedId
              ? 'bg-active bg-opacity-50 font-bold text-gray-900'
              : 'hover:bg-[#81F8B1] text-gray-700'
          "
        >
          <span>{{ index + 1 }}.</span>
          <span>{{ todo.title }}</span>
          <div
            v-if="todo.id === selectedId"
            class="absolute right-0 top-1/2 transform -translate-y-1/2"
            style="
              width: 0;
              height: 0;
              border-top: 10px solid transparent;
              border-bottom: 10px solid transparent;
              border-right: 10px solid white;
              z-index: 10;
            "
            aria-hidden="true"
          ></div>
        </li>
      </ul>
      <div class="flex justify-center">
        <ButtonComponent @click="createTodo" :disabled="todos.length >= 10" class="w-4/5 mx-auto">
          Add Item
        </ButtonComponent>
      </div>
    </div>
    <div class="w-4/5 mx-auto mb-4 relative">
      <img
        v-if="imgSampleObj.src"
        class="w-full h-auto"
        :src="imgSampleObj.src"
        alt=""
        @click="changeImg"
      />
      <span v-if="imgSampleObj.loading">圖片載入中...</span>
    </div>
  </div>
</template>

<style scoped>
  .bg-active {
    background-color: #81f8b1;
  }
</style>

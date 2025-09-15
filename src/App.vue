<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import TodoSlider from './components/TodoSlider.vue'
  import TodoDetail from './components/TodoDetail.vue'

  import { getPicsumById } from './api/picsum.ts'

  interface Todo {
    id: number
    title: string
    startDate: string
    endDate: string
    image: string
    content: string
  }

  // 樣本數據
  const sampleTodos: Todo[] = [
    {
      id: 1,
      title: '完成專案報告',
      startDate: '2025/09/01',
      endDate: '2025/09/20',
      image:
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1472&q=80',
      content: '需要完成第三季度的專案進度報告，包括所有里程碑和遇到的挑戰。',
    },
    {
      id: 2,
      title: '購買辦公用品',
      startDate: '2025/08/11',
      endDate: '2025/08/30',
      image:
        'https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      content: '需要購買新的筆記本、筆和打印紙。',
    },
  ]

  const todos = ref<Todo[]>([])
  const selectedId = ref<number | null>(null)
  const currentTodo = ref<Todo | null>(null)
  const imgSample = ref('')

  // 格式化日期為 yyyy/mm/dd
  const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }
  let index = 1

  const getImg = () => {
    getPicsumById(index).then((res) => {
      imgSample.value = res.download_url
      index++
    })
  }
  const changeImg = () => {
    getImg()
  }

  // 初始化數據
  onMounted(() => {
    todos.value = [...sampleTodos]
    getImg()
    resetSelectTodo()
  })

  // 創建新的 Todo
  const createTodo = () => {
    if (todos.value.length >= 10) {
      alert('已達到最大數量')
      return
    }
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    const newTodo: Todo = {
      id: Date.now(),
      title: 'new item title ',
      startDate: formatDate(today),
      endDate: formatDate(nextWeek),
      image: '',
      content: '',
    }

    todos.value.push(newTodo)
    selectedId.value = newTodo.id
    currentTodo.value = newTodo
  }

  // 選擇 Todo
  const selectTodo = (id: number) => {
    selectedId.value = id
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      currentTodo.value = todo
    }
  }

  // 刪除 Todo
  const deleteTodo = (id: number) => {
    const index = todos.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
      if (id === selectedId.value) {
        resetSelectTodo()
      }
    }
  }

  const resetSelectTodo = () => {
    let tempId = todos.value.length > 0 ? todos.value[0].id : null
    if (tempId === null) {
      selectedId.value = null
      currentTodo.value = null
      return
    }
    selectTodo(tempId)
  }

  // 監聽 currentTodo 的所有變化，自動同步到 todos 數組
  watch(
    () => currentTodo.value,
    (newTodo) => {
      if (newTodo && selectedId.value !== null) {
        const index = todos.value.findIndex((t) => t.id === selectedId.value)
        if (index !== -1) {
          // 使用整個對象的深拷貝來更新，確保所有字段都被更新
          todos.value[index] = { ...newTodo }
        }
      }
    },
    { deep: true } // 深度監聽，確保對象內部屬性變化也能被檢測到
  )

  const isSidebarOpen = ref(true)
  // 設置側邊欄狀態的函數
  const setSidebar = (isOpen: boolean) => {
    isSidebarOpen.value = isOpen
  }
</script>

<template>
  <div class="grid grid-cols-12 gap-0">
    <!-- 桌面版側邊欄 (永遠展開) -->
    <div class="hidden md:block h-screen col-span-3">
      <div class="bg-primary py-4 h-screen rounded shadow">
        <TodoSlider
          :todos="todos"
          :selectedId="selectedId"
          :imgSample="imgSample"
          @select-todo="selectTodo"
          @create-todo="createTodo"
          @changeImg="changeImg"
        />
      </div>
    </div>

    <!-- 手機版側邊欄 (可切換顯示/隱藏) -->
    <div v-if="isSidebarOpen" class="md:hidden fixed top-0 left-0 w-full h-screen z-50 flex">
      <div class="bg-primary w-2/3 py-4 rounded-r shadow relative h-full overflow-y-auto">
        <TodoSlider
          :todos="todos"
          :selectedId="selectedId"
          :imgSample="imgSample"
          @select-todo="selectTodo"
          @create-todo="createTodo"
          @setSidebar="setSidebar(false)"
        />
      </div>
      <!-- 右側半透明遮罩 -->
      <div class="flex-1 bg-gray-800 bg-opacity-50" @click="setSidebar(false)"></div>
    </div>

    <!-- 右側主要內容 -->
    <div class="col-span-12 md:col-span-9 bg-white p-4 rounded shadow w-full">
      <div v-if="currentTodo">
        <TodoDetail
          v-model:currentTodo="currentTodo"
          :imgSample="imgSample"
          @delete-todo="deleteTodo"
          @set-sidebar="setSidebar"
        />
      </div>
      <div v-else class="text-center py-12 text-gray-500">
        <p class="mb-4">請選擇或新增一個項目</p>
        <button
          @click="createTodo"
          class="bg-primary hover:bg-opacity-80 text-gray-800 py-2 px-4 rounded"
        >
          新增項目
        </button>
      </div>
    </div>
  </div>
</template>

<style>
  :root {
    --primary: #a1ffc7;
  }
  .bg-primary {
    background-color: var(--primary);
  }
  .hover\:bg-opacity-80:hover {
    opacity: 0.8;
  }
</style>

<template>
  <button
    :disabled="disabled"
    class="px-4 py-2 rounded-lg font-medium transition-all text-gray-900 border border-transparent hover:opacity-90 active:scale-95 disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed"
    :style="{ backgroundColor: disabled ? '' : '#E7FFE9' }"
  >
    <slot>按鈕</slot>
  </button>
</template>

<script setup lang="ts">
  defineProps<{
    disabled?: boolean
  }>()
</script>

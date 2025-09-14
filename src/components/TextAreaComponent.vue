<template>
  <div class="textarea-container">
    <textarea
      class="custom-textarea"
      :placeholder="placeholder"
      v-model="model"
      :rows="rows"
      :maxlength="maxLength"
      @input="updateModel"
    ></textarea>
    <div class="character-count">
      <span>{{ maxLength }}/{{ currentLength }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineModel, computed } from 'vue'

  interface TextareaProps {
    placeholder?: string
    rows?: number
    maxLength?: number
  }

  const props = withDefaults(defineProps<TextareaProps>(), {
    placeholder: '',
    rows: 4,
    maxLength: 200,
  })

  // 使用 defineModel 來創建雙向綁定
  const model = defineModel<string>()

  // 計算當前字數
  const currentLength = computed(() => {
    return model.value?.length || 0
  })

  // 確保不超過最大字數
  const updateModel = () => {
    if (model.value && model.value.length > props.maxLength) {
      model.value = model.value.substring(0, props.maxLength)
    }
  }
</script>

<style scoped>
  .textarea-container {
    margin-bottom: 15px;
    position: relative;
  }

  .custom-textarea {
    width: 100%;
    height: 100%;
    display: block;
    padding: 10px;
    padding-bottom: 30px; /* 為字數計數器留出空間 */
    border: none;
    border-radius: 4px;
    background-color: #f0f0f0; /* 灰色背景 */
    font-size: 16px;
    box-sizing: border-box;
    resize: vertical;
    font-family: inherit;
    min-height: 100px;
  }

  .custom-textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    border: none;
  }

  .character-count {
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: #e7ffe9;
    padding: 2px 8px;
    font-size: 12px;
    color: #555;
    clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%);
    min-width: 60px;
    text-align: center;
  }

  .character-count span {
    margin-left: 10px;
  }
</style>

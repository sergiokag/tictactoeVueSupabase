<template>
  <span class="typewriter-container">
    <span class="typewriter-text">{{ displayedText }}</span>
    <span class="typewriter-cursor" v-if="isTyping"></span>
  </span>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{
  text: string
  speed?: number
  delay?: number
}>()

const displayedText = ref('')
const isTyping = ref(false)

const typeText = async () => {
  isTyping.ref = true
  displayedText.value = ''
  
  if (props.delay) {
    await new Promise(resolve => setTimeout(resolve, props.delay))
  }

  for (let i = 0; i < props.text.length; i++) {
    displayedText.value += props.text[i]
    await new Promise(resolve => setTimeout(resolve, props.speed || 50))
  }
  
  isTyping.value = false
}

watch(() => props.text, typeText)

onMounted(typeText)
</script>

<style scoped>
.typewriter-container {
  display: inline-flex;
  align-items: center;
}

.typewriter-text {
  white-space: pre-wrap;
}

.typewriter-cursor {
  display: inline-block;
  width: 8px;
  height: 1.2em;
  background-color: currentColor;
  margin-left: 2px;
  animation: blink 0.75s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>

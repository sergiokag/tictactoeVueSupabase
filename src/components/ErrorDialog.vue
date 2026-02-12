<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div @click="close" class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
    
    <!-- Dialog -->
    <div class="relative glass-panel p-8 max-w-sm w-full border-neon-pink/50 animate-flicker">
      <h2 class="text-2xl font-bold neon-text-pink mb-4 uppercase tracking-widest">System Failure</h2>
      <p class="text-white/80 font-mono mb-8">{{ errorMessage }}</p>
      <button 
        @click="close"
        class="w-full py-3 border border-white/20 hover:bg-white/5 transition-colors uppercase tracking-widest text-xs"
      >
        Acknowledge
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShowErrorMessage } from '../composables/userShowErrorMessage'

const { isOpen, errorMessage, close } = useShowErrorMessage()
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-9999 flex items-center justify-center p-4 animate-backdrop-enter"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

      <!-- Dialog -->
      <div
        class="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border-2 border-white/50 dark:border-slate-700/50 animate-dialog-enter"
      >
        <!-- Top accent bar -->
        <div class="h-2 bg-linear-to-r from-rose-500 via-pink-500 to-orange-500"></div>

        <!-- Content -->
        <div class="p-6 sm:p-8">
          <!-- Error icon -->
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 bg-linear-to-br from-rose-100 to-pink-100 dark:from-rose-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                class="w-8 h-8 text-rose-500 dark:text-rose-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <h2 class="text-2xl font-black text-center text-slate-800 dark:text-white mb-3">Oops!</h2>

          <!-- Message -->
          <p class="text-center text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-6">
            {{ errorMessage }}
          </p>

          <!-- Close button -->
          <button
            @click="close"
            class="w-full py-3 px-6 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-rose-500/30 transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-400/50"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useShowErrorMessage } from '../composables/userShowErrorMessage'

const { isOpen, errorMessage, close } = useShowErrorMessage()
</script>

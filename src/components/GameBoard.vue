<template>
  <div class="flex flex-col items-center gap-6">
    <!-- Game board -->
    <div
      class="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-white/50 dark:border-slate-700/50"
    >
      <div class="grid grid-cols-3 gap-3 sm:gap-4">
        <button
          v-for="(cell, index) in cells"
          :key="index"
          @click="play(index)"
          :disabled="game?.status !== 'in_progress' || cell !== '-'"
          class="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl text-4xl sm:text-5xl md:text-6xl font-black flex items-center justify-center transition-all duration-200 transform focus:outline-none focus:ring-4"
          :class="getCellClasses(cell, index)"
        >
          <span
            v-if="cell !== '-'"
            class="animate-pop-in"
            :class="
              cell === 'X'
                ? 'text-rose-500 dark:text-rose-400 drop-shadow-lg'
                : 'text-cyan-500 dark:text-cyan-400 drop-shadow-lg'
            "
          >
            {{ cell }}
          </span>
        </button>
      </div>
    </div>

    <!-- Status display -->
    <div class="text-center">
      <!-- Waiting for player -->
      <div
        v-if="game?.status === 'waiting'"
        class="inline-flex items-center gap-3 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-6 py-3 rounded-2xl shadow-lg border-2 border-amber-200 dark:border-amber-700/50 animate-slide-up"
      >
        <div class="flex gap-1">
          <span
            class="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
            style="animation-delay: 0ms"
          ></span>
          <span
            class="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
            style="animation-delay: 150ms"
          ></span>
          <span
            class="w-2 h-2 bg-amber-500 rounded-full animate-bounce"
            style="animation-delay: 300ms"
          ></span>
        </div>
        <span class="font-bold">Waiting for player O to join</span>
      </div>

      <!-- Current turn -->
      <div
        v-else-if="game?.status === 'in_progress'"
        class="inline-flex items-center gap-3 px-6 py-3 rounded-2xl shadow-lg border-2 animate-slide-up"
        :class="
          game.current_turn === 'X'
            ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-700/50'
            : 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/50'
        "
      >
        <span class="font-bold text-lg">Current Turn:</span>
        <span
          class="text-3xl font-black"
          :class="
            game.current_turn === 'X'
              ? 'text-rose-500 dark:text-rose-400'
              : 'text-cyan-500 dark:text-cyan-400'
          "
        >
          {{ game.current_turn }}
        </span>
      </div>

      <!-- X Wins -->
      <div
        v-else-if="game?.status === 'X_won'"
        class="inline-flex items-center gap-3 bg-linear-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl shadow-xl animate-celebrate"
      >
        <span class="text-4xl">🎉</span>
        <span class="font-black text-2xl">X Wins!</span>
        <span class="text-4xl">🎉</span>
      </div>

      <!-- O Wins -->
      <div
        v-else-if="game?.status === 'O_won'"
        class="inline-flex items-center gap-3 bg-linear-to-r from-cyan-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-xl animate-celebrate"
      >
        <span class="text-4xl">🎉</span>
        <span class="font-black text-2xl">O Wins!</span>
        <span class="text-4xl">🎉</span>
      </div>

      <!-- Draw -->
      <div
        v-else-if="game?.status === 'draw'"
        class="inline-flex items-center gap-3 bg-linear-to-r from-purple-500 to-violet-500 text-white px-8 py-4 rounded-2xl shadow-xl animate-slide-up"
      >
        <span class="text-3xl">🤝</span>
        <span class="font-black text-2xl">It's a Draw!</span>
        <span class="text-3xl">🤝</span>
      </div>
    </div>

    <!-- Play Again button (shown when game is over) -->
    <div v-if="isGameOver" class="mt-4 animate-slide-up">
      <button
        @click="playAgain"
        class="inline-flex items-center gap-2 py-3 px-6 bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/30 transform transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Play Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const { makeMove, restartGame } = gameStore
const game = computed(() => gameStore.game)
const cells = computed(() => game.value?.board.split('') ?? [])
const isGameOver = computed(() => {
  const status = game.value?.status
  return status === 'X_won' || status === 'O_won' || status === 'draw'
})

async function playAgain() {
  await restartGame()
}

function play(pos: number) {
  if (!game.value) return
  if (game.value.status !== 'in_progress') return
  if (cells.value[pos] !== '-') return

  makeMove(pos)
}

function getCellClasses(cell: string) {
  const baseClasses =
    'bg-white dark:bg-slate-700 shadow-lg border-2 border-slate-100 dark:border-slate-600'

  if (cell !== '-') {
    // Cell is occupied
    return `${baseClasses} cursor-default`
  }

  if (game.value?.status === 'in_progress') {
    // Empty cell, game in progress - can click
    return `${baseClasses} cursor-pointer hover:scale-110 hover:shadow-xl hover:border-fuchsia-300 dark:hover:border-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30 focus:ring-fuchsia-400/50 active:scale-95`
  }

  // Empty cell but game not in progress
  return `${baseClasses} cursor-not-allowed opacity-60`
}
</script>

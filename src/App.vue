<template>
  <div
    class="min-h-screen bg-linear-to-br from-violet-400 via-fuchsia-400 to-cyan-400 dark:from-violet-950 dark:via-fuchsia-950 dark:to-slate-900 relative overflow-hidden"
  >
    <!-- Floating decorative shapes -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute top-20 left-10 w-32 h-32 bg-yellow-300/30 dark:bg-yellow-400/20 rounded-full blur-xl animate-float"
      ></div>
      <div
        class="absolute top-40 right-20 w-24 h-24 bg-pink-300/40 dark:bg-pink-400/20 rounded-full blur-lg animate-float-delayed"
      ></div>
      <div
        class="absolute bottom-32 left-1/4 w-40 h-40 bg-cyan-300/30 dark:bg-cyan-400/20 rounded-full blur-xl animate-float"
      ></div>
      <div
        class="absolute bottom-20 right-1/3 w-20 h-20 bg-purple-300/40 dark:bg-purple-400/20 rounded-full blur-lg animate-float-delayed"
      ></div>
      <div
        class="absolute top-1/3 left-1/2 w-28 h-28 bg-rose-300/30 dark:bg-rose-400/20 rounded-full blur-xl animate-float"
      ></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <!-- Title -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-8 drop-shadow-lg">
        <span
          class="bg-linear-to-r from-rose-500 via-fuchsia-500 to-cyan-500 dark:from-rose-400 dark:via-fuchsia-400 dark:to-cyan-400 bg-clip-text text-transparent animate-shimmer"
        >
          Tic Tac Toe
        </span>
        <span
          class="block text-2xl sm:text-3xl mt-2 text-white/90 dark:text-white/80 font-bold tracking-wide"
        >
          Multiplayer
        </span>
      </h1>

      <!-- Game setup panel -->
      <div v-if="!game" class="animate-slide-up">
        <div
          class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border-4 border-white/50 dark:border-slate-700/50 max-w-md w-full"
        >
          <div class="space-y-6">
            <!-- Create game button -->
            <button
              @click="createGame"
              class="w-full py-4 px-6 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-rose-500/30 transform transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-4 focus:ring-rose-400/50"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create New Game
              </span>
            </button>

            <!-- Divider -->
            <div class="flex items-center gap-4">
              <div
                class="flex-1 h-0.5 bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"
              ></div>
              <span
                class="text-slate-500 dark:text-slate-400 font-medium text-sm uppercase tracking-wider"
                >or</span
              >
              <div
                class="flex-1 h-0.5 bg-linear-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"
              ></div>
            </div>

            <!-- Join game section -->
            <div class="space-y-3">
              <input
                v-model="joinId"
                placeholder="Enter Game ID"
                class="w-full py-4 px-6 bg-white dark:bg-slate-700 border-3 border-slate-200 dark:border-slate-600 rounded-2xl text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-medium text-center text-lg focus:outline-none focus:border-cyan-400 dark:focus:border-cyan-500 focus:ring-4 focus:ring-cyan-400/30 transition-all duration-200"
              />
              <button
                @click="join"
                class="w-full py-4 px-6 bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-cyan-500/30 transform transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-400/50"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Join Game
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Game in progress -->
      <div v-else class="animate-slide-up">
        <!-- Back button and Game ID display -->
        <div class="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            @click="goBack"
            class="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-lg border-2 border-white/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 font-medium hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <IconBack />
            Back
          </button>
          <div
            class="inline-flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-lg border-2 border-white/50 dark:border-slate-700/50"
          >
            <span class="text-slate-500 dark:text-slate-400 font-medium">Game ID:</span>
            <span
              class="font-mono font-bold text-lg text-fuchsia-600 dark:text-fuchsia-400 tracking-wider"
              >{{ game.id }}</span
            >
          </div>
        </div>

        <!-- Game board -->
        <GameBoard />
      </div>
    </div>
  </div>
  <ErrorDialog />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from './stores/gameStore'
import GameBoard from './components/GameBoard.vue'
import ErrorDialog from './components/ErrorDialog.vue'
import IconBack from './components/icons/IconBack.vue'

const joinId = ref('')

const gameStore = useGameStore()
const game = computed(() => gameStore.game)
const { initSession, createGame, joinGame, leaveGame } = useGameStore()

async function join() {
  await joinGame(joinId.value)
}

function goBack() {
  leaveGame()
  joinId.value = ''
}

onMounted(async () => {
  await initSession()
})
</script>

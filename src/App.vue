<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background layers for parallax -->
    <div 
      class="fixed inset-0 pointer-events-none z-0"
      :style="backgroundStyle"
    >
      <div class="absolute inset-0 bg-[#0F0F0F]"></div>
      <div class="scanlines"></div>
      <div class="film-grain"></div>
    </div>

    <div class="w-full max-w-2xl relative z-10" :style="containerStyle">
      <h1 class="text-5xl font-bold text-center mb-12 animate-flicker">
        <span class="neon-text-pink">TIC TAC</span>
        <span class="neon-text-cyan ml-4">TOE</span>
        <div class="text-sm uppercase tracking-[0.5em] mt-2 opacity-70">
          <Typewriter text="Multiplayer Noir" :speed="100" />
        </div>
      </h1>

      <!-- Game setup panel -->
      <div v-if="!game" class="glass-panel p-8 space-y-8">
        <div class="flex flex-col space-y-6">
          <!-- Create game button -->
          <button 
            @click="createGame"
            class="neon-border-pink py-4 px-8 text-xl font-bold hover:bg-neon-pink/10 transition-colors cursor-pointer"
          >
            INITIALIZE NEW CASE
          </button>

          <!-- Divider -->
          <div class="flex items-center space-x-4">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-xs uppercase tracking-widest opacity-50">or</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Join game section -->
          <div class="flex flex-col space-y-4">
            <input 
              v-model="joinId" 
              placeholder="ENTER CASE ID..." 
              class="bg-black/40 border border-white/10 p-4 font-mono text-center focus:outline-none focus:border-neon-cyan/50 transition-colors"
            />
            <button 
              @click="join"
              class="neon-border-cyan py-4 px-8 text-xl font-bold hover:bg-neon-cyan/10 transition-colors cursor-pointer"
            >
              JOIN INVESTIGATION
            </button>
          </div>
        </div>
      </div>

      <!-- Game in progress -->
      <div v-else class="space-y-6">
        <!-- Back button and Game ID display -->
        <div class="flex justify-between items-center">
          <button 
            @click="goBack"
            class="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            <span>←</span> ABANDON CASE
          </button>
          <div class="glass-panel px-4 py-2 flex items-center gap-3">
            <span class="text-xs uppercase opacity-50">Case ID:</span>
            <span class="font-mono text-neon-cyan">
              <Typewriter :text="game.id" :speed="150" />
            </span>
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
import { useParallax } from '@vueuse/core'
import GameBoard from './components/GameBoard.vue'
import ErrorDialog from './components/ErrorDialog.vue'
import Typewriter from './components/Typewriter.vue'

const container = ref(null)
const { tilt, roll, source } = useParallax(container)

const containerStyle = computed(() => ({
  transform: `rotateX(${roll.value * 10}deg) rotateY(${tilt.value * 10}deg)`,
  transition: 'transform 0.1s ease-out'
}))

const backgroundStyle = computed(() => ({
  transform: `translateX(${tilt.value * -20}px) translateY(${roll.value * -20}px)`,
  transition: 'transform 0.1s ease-out'
}))

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
  container.value = document.documentElement as any
  await initSession()
})
</script>

<template>
  <div class="space-y-8 relative">
    <!-- Game board -->
    <div class="glass-panel p-4 aspect-square max-w-md mx-auto relative overflow-hidden">
      <!-- Winning Line (Red String) -->
      <svg 
        v-if="winningLine" 
        class="absolute inset-0 w-full h-full pointer-events-none z-20"
        viewBox="0 0 300 300"
      >
        <line 
          :x1="lineCoords.x1" :y1="lineCoords.y1" 
          :x2="lineCoords.x2" :y2="lineCoords.y2" 
          stroke="#FF0000" 
          stroke-width="4" 
          stroke-linecap="round"
          class="winning-line-glow"
          ref="winLineRef"
        />
      </svg>

      <div class="grid grid-cols-3 gap-4 h-full">
        <button
          v-for="(cell, index) in cells"
          :key="index"
          @click="play(index)"
          :disabled="game?.status !== 'in_progress' || cell !== '-'"
          class="relative flex items-center justify-center bg-black/40 border border-white/5 hover:border-white/20 transition-all group disabled:cursor-not-allowed aspect-square"
          :class="{
            'neon-border-pink/30': cell === 'X',
            'neon-border-cyan/30': cell === 'O'
          }"
        >
          <span 
            v-if="cell === 'X'" 
            class="text-5xl font-bold neon-text-pink animate-flicker"
            v-motion
            :initial="{ scale: 0, rotate: -45, opacity: 0 }"
            :enter="{ scale: 1, rotate: 0, opacity: 1 }"
          >
            X
          </span>
          <span 
            v-if="cell === 'O'" 
            class="text-5xl font-bold neon-text-cyan animate-flicker"
            v-motion
            :initial="{ scale: 0, rotate: 45, opacity: 0 }"
            :enter="{ scale: 1, rotate: 0, opacity: 1 }"
          >
            O
          </span>
        </button>
      </div>
    </div>

    <!-- Status display -->
    <div class="text-center h-24 flex items-center justify-center">
      <!-- Waiting for player -->
      <div v-if="game?.status === 'waiting'" class="flex flex-col items-center gap-2">
        <div class="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        <span class="text-xs uppercase tracking-[0.3em] opacity-70">
          <Typewriter text="Awaiting accomplice (Player O)..." />
        </span>
      </div>

      <!-- Current turn -->
      <div v-else-if="game?.status === 'in_progress'" class="flex flex-col items-center gap-1">
        <span class="text-[10px] uppercase tracking-[0.5em] opacity-50">Current Turn</span>
        <div 
          class="text-2xl font-bold tracking-widest"
          :class="game.current_turn === 'X' ? 'neon-text-pink' : 'neon-text-cyan'"
        >
          <Typewriter :text="'PLAYER ' + game.current_turn" />
        </div>
      </div>

      <!-- X Wins -->
      <div v-else-if="game?.status === 'X_won'" class="space-y-2">
        <div class="text-4xl font-bold neon-text-pink animate-flicker">
          <Typewriter text="CASE CLOSED: X VICTORIOUS" />
        </div>
        <div class="text-[10px] uppercase tracking-[0.5em] opacity-50">
          <Typewriter text="Evidence Marker X secured the board" :delay="1000" />
        </div>
      </div>

      <!-- O Wins -->
      <div v-else-if="game?.status === 'O_won'" class="space-y-2">
        <div class="text-4xl font-bold neon-text-cyan animate-flicker">
          <Typewriter text="CASE CLOSED: O VICTORIOUS" />
        </div>
        <div class="text-[10px] uppercase tracking-[0.5em] opacity-50">
          <Typewriter text="Case File Stamp O dominated the field" :delay="1000" />
        </div>
      </div>

      <!-- Draw -->
      <div v-else-if="game?.status === 'draw'" class="space-y-2">
        <div class="text-4xl font-bold text-white/70">
          <Typewriter text="COLD CASE: STALEMATE" />
        </div>
        <div class="text-[10px] uppercase tracking-[0.5em] opacity-50">
          <Typewriter text="No definitive proof found" :delay="1000" />
        </div>
      </div>
    </div>

    <!-- Play Again button (shown when game is over) -->
    <div v-if="isGameOver" class="flex justify-center">
      <button 
        @click="playAgain"
        class="neon-border-pink py-3 px-12 font-bold hover:bg-neon-pink/10 transition-all cursor-pointer uppercase tracking-widest"
      >
        Reopen Investigation
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import gsap from 'gsap'
import Typewriter from './Typewriter.vue'

const gameStore = useGameStore()
const { makeMove, restartGame } = gameStore
const game = computed(() => gameStore.game)
const cells = computed(() => game.value?.board.split('') ?? [])
const isGameOver = computed(() => {
  const status = game.value?.status
  return status === 'X_won' || status === 'O_won' || status === 'draw'
})

const winLineRef = ref<SVGLineElement | null>(null)

const winningLine = computed(() => {
  if (!game.value?.board) return null
  const b = game.value.board
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ]
  for (const line of lines) {
    if (b[line[0]] !== '-' && b[line[0]] === b[line[1]] && b[line[0]] === b[line[2]]) {
      return line
    }
  }
  return null
})

const lineCoords = computed(() => {
  if (!winningLine.value) return { x1: 0, y1: 0, x2: 0, y2: 0 }
  const line = winningLine.value
  const getCoords = (idx: number) => {
    const row = Math.floor(idx / 3)
    const col = idx % 3
    return { x: col * 100 + 50, y: row * 100 + 50 }
  }
  const start = getCoords(line[0])
  const end = getCoords(line[2])
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y }
})

watch(winningLine, (newLine) => {
  if (newLine) {
    setTimeout(() => {
      if (winLineRef.value) {
        gsap.fromTo(winLineRef.value, 
          { strokeDasharray: 400, strokeDashoffset: 400 },
          { strokeDashoffset: 0, duration: 1, ease: "power2.out" }
        )
      }
    }, 100)
  }
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
</script>

<style scoped>
.winning-line-glow {
  filter: drop-shadow(0 0 5px #FF0000) drop-shadow(0 0 10px #FF0000);
}
</style>

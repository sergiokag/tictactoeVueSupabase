<template>
  <div>
    <!-- Game board -->
    <div>
      <div>
        <button
          v-for="(cell, index) in cells"
          :key="index"
          @click="play(index)"
          :disabled="game?.status !== 'in_progress' || cell !== '-'"
        >
          <span v-if="cell !== '-'">{{ cell }}</span>
        </button>
      </div>
    </div>

    <!-- Status display -->
    <div>
      <!-- Waiting for player -->
      <div v-if="game?.status === 'waiting'">
        <span>Waiting for player O to join</span>
      </div>

      <!-- Current turn -->
      <div v-else-if="game?.status === 'in_progress'">
        <span>Current Turn:</span>
        <span>{{ game.current_turn }}</span>
      </div>

      <!-- X Wins -->
      <div v-else-if="game?.status === 'X_won'">
        <span>X Wins!</span>
      </div>

      <!-- O Wins -->
      <div v-else-if="game?.status === 'O_won'">
        <span>O Wins!</span>
      </div>

      <!-- Draw -->
      <div v-else-if="game?.status === 'draw'">
        <span>It's a Draw!</span>
      </div>
    </div>

    <!-- Play Again button (shown when game is over) -->
    <div v-if="isGameOver">
      <button @click="playAgain">Play Again</button>
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

</script>

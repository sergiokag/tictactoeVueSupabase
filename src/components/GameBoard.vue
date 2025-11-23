<template>
  <div class="board">
    <div class="cell" v-for="(cell, index) in cells" :key="index" @click="play(index)">
      {{ cell }}
    </div>
  </div>

  <div class="info">
    <p v-if="game?.status === 'waiting'">Waiting for player O to join…</p>
    <p v-else-if="game?.status === 'in_progress'">Turn: {{ game.current_turn }}</p>
    <p v-else-if="game?.status === 'X_won'">X Wins!</p>
    <p v-else-if="game?.status === 'O_won'">O Wins!</p>
    <p v-else-if="game?.status === 'draw'">Draw!</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()
const { makeMove } = gameStore
const game = computed(() => gameStore.game)
const cells = computed(() => game.value?.board.split('') ?? [])

function play(pos: number) {
  if (!game.value) return
  if (game.value.status !== 'in_progress') return
  if (cells.value[pos] !== '-') return

  makeMove(pos)
}
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 80px);
  gap: 4px;
}
.cell {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  font-size: 2rem;
  cursor: pointer;
}
</style>

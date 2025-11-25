<template>
  <div class="container">
    <h1>Tic Tac Toe Multiplayer</h1>

    <div v-if="!game">
      <button @click="createGame">Create Game</button>

      <div>
        <input v-model="joinId" placeholder="Game ID" />
        <button @click="join">Join</button>
      </div>
    </div>

    <div v-else>
      <p>Game ID: {{ game.id }}</p>
      <GameBoard />
    </div>
  </div>
  <ErrorDialog />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useGameStore } from './stores/gameStore'
import GameBoard from './components/GameBoard.vue'
import ErrorDialog  from './components/ErrorDialog.vue'

const joinId = ref('')

const gameStore = useGameStore()
const game = computed(() => gameStore.game)
const { initSession, createGame, joinGame } = useGameStore()

async function join() {
  await joinGame(joinId.value)
}

onMounted(async () => {
  await initSession()
})
</script>

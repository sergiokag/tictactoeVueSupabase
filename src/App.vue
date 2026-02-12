<template>
  <div>
    <div>
      <h1>
        <span>Tic Tac Toe</span>
        <span>Multiplayer</span>
      </h1>

      <!-- Game setup panel -->
      <div v-if="!game">
        <div>
          <div>
            <!-- Create game button -->
            <button @click="createGame">Create New Game</button>

            <!-- Divider -->
            <div>
              <span>or</span>
            </div>

            <!-- Join game section -->
            <div>
              <input v-model="joinId" placeholder="Enter Game ID" />
              <button @click="join">Join Game</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Game in progress -->
      <div v-else>
        <!-- Back button and Game ID display -->
        <div>
          <button @click="goBack">Back</button>
          <div>
            <span>Game ID:</span>
            <span>{{ game.id }}</span>
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

<template>
  <div v-if="isOpen">
    <div @click="close"></div>
    <div>
      <h2>Error</h2>
      <p>{{ errorMessage }}</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useShowErrorMessage } from '../composables/userShowErrorMessage'

const { isOpen, errorMessage, close } = useShowErrorMessage()
</script>

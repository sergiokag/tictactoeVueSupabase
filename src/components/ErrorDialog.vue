<template>
  <Teleport to="body">
  <div v-if="isOpen" class="dialog-backdrop">
    <div class="dialog">
      <h2>Error</h2>
      <p>{{ errorMessage }}</p>
      <button @click="close">OK</button>
    </div>
  </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useShowErrorMessage } from '../composables/userShowErrorMessage';

const { isOpen, errorMessage, close } = useShowErrorMessage();
</script>

<style>
.dialog-backdrop {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.dialog {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 350px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
</style>

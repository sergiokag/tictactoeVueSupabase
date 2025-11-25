import { ref } from 'vue'

const isOpen = ref(false)
const errorMessage = ref<string | null>(null)

export function useShowErrorMessage() {
  function showError(message: string | unknown) {
    errorMessage.value = normalizeError(message)
    isOpen.value = true
  }
  function close() {
    isOpen.value = false
    errorMessage.value = null
  }
  return { isOpen, errorMessage, showError, close }
}

function normalizeError(err: unknown): string {
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  if (typeof err === 'object' && err && 'message' in err) {
    return String(err.message)
  }
  return 'An unexpected error occurred.'
}

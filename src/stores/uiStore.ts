import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // "Juice" settings
  const animationSpeed = ref(1.0)
  const screenShakeIntensity = ref(0.5)
  const neonFlickerFrequency = ref(0.8)
  
  // Theme settings
  const isDark = ref(true)
  
  function setJuice(speed: number, shake: number, flicker: number) {
    animationSpeed.value = speed
    screenShakeIntensity.value = shake
    neonFlickerFrequency.value = flicker
  }

  return {
    animationSpeed,
    screenShakeIntensity,
    neonFlickerFrequency,
    isDark,
    setJuice
  }
})

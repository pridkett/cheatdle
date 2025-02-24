<script setup lang="ts">
import { useWordleStore } from '@/stores/wordleStore'
import { onMounted, onUnmounted } from 'vue'

const store = useWordleStore()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    store.submitGuess()
  } else if (event.key === 'Backspace') {
    store.removeLetter()
  } else if (/^[a-zA-Z]$/.test(event.key)) {
    store.addLetter(event.key)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="grid grid-rows-6 gap-2 p-4 max-w-md mx-auto">
    <div v-for="(row, rowIndex) in 6" :key="rowIndex" class="grid grid-cols-5 gap-2 justify-center">
      <div 
        v-for="(col, colIndex) in 5" 
        :key="colIndex"
        @click="store.cycleColor(rowIndex, colIndex)"
        class="w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold cursor-pointer 
               transition-all duration-500 transform perspective-500
               [transform-style:preserve-3d] select-none
               dark:text-white"
        :class="{
          'bg-white border-gray-300 dark:border-gray-600': store.guesses[rowIndex]?.[colIndex]?.color === 'white',
          'bg-yellow-300 border-yellow-400 [transform:rotateX(360deg)]': store.guesses[rowIndex]?.[colIndex]?.color === 'yellow',
          'bg-green-500 border-green-600 [transform:rotateX(360deg)]': store.guesses[rowIndex]?.[colIndex]?.color === 'green',
          'bg-gray-400 border-gray-500 [transform:rotateX(360deg)]': store.guesses[rowIndex]?.[colIndex]?.color === 'gray'
        }"
      >
        {{ store.guesses[rowIndex]?.[colIndex]?.letter || '' }}
      </div>
    </div>
  </div>
</template>

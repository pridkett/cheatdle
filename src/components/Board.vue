<script lang="ts">
export default {
  name: 'WordleBoard'
}
</script>

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
  <div class="p-1 sm:p-4 w-full max-w-md mx-auto">
    <div class="grid grid-rows-6 gap-1 sm:gap-2">
      <div v-for="(row, rowIndex) in 6" :key="rowIndex" 
           class="grid grid-cols-5 gap-1 sm:gap-2 justify-items-center">
        <div
          v-for="(col, colIndex) in 5"
          :key="colIndex"
          @click="store.cycleColor(rowIndex, colIndex)"
          class="letter-cell"
          :class="{
            'letter-cell-white': store.guesses[rowIndex]?.[colIndex]?.color === 'white',
            'letter-cell-yellow': store.guesses[rowIndex]?.[colIndex]?.color === 'yellow',
            'letter-cell-green': store.guesses[rowIndex]?.[colIndex]?.color === 'green',
            'letter-cell-gray': store.guesses[rowIndex]?.[colIndex]?.color === 'gray'
          }"
        >
          {{ store.guesses[rowIndex]?.[colIndex]?.letter || '' }}
        </div>
      </div>
    </div>
  </div>
</template>

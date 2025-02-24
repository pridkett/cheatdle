<script setup lang="ts">
import { useWordleStore } from '@/stores/wordleStore'

const store = useWordleStore()
</script>

<template>
  <div class="grid grid-rows-6 gap-2 p-4">
    <div v-for="(row, rowIndex) in 6" :key="rowIndex" class="grid grid-cols-5 gap-2">
      <div 
        v-for="(col, colIndex) in 5" 
        :key="colIndex"
        @click="store.cycleColor(rowIndex, colIndex)"
        class="w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold cursor-pointer transition-colors"
        :class="{
          'bg-white border-gray-300 dark:border-gray-600': store.guesses[rowIndex]?.[colIndex]?.color === 'white',
          'bg-yellow-300 border-yellow-400': store.guesses[rowIndex]?.[colIndex]?.color === 'yellow',
          'bg-green-500 border-green-600': store.guesses[rowIndex]?.[colIndex]?.color === 'green',
          'bg-gray-400 border-gray-500': store.guesses[rowIndex]?.[colIndex]?.color === 'gray'
        }"
      >
        {{ store.guesses[rowIndex]?.[colIndex]?.letter || '' }}
      </div>
    </div>
  </div>
</template>

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
        class="w-14 h-14 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-2xl font-bold"
      >
        {{ store.guesses[rowIndex]?.[colIndex]?.letter || '' }}
      </div>
    </div>
  </div>
</template>

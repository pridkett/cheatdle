<script setup lang="ts">
import { useWordleStore } from '@/stores/wordleStore'
import { computed } from 'vue'

const store = useWordleStore()
const tooManyMatches = computed(() => store.filteredWords.length > 500)
const sortedWords = computed(() => {
  const words = [...store.filteredWords].sort((a, b) => b.frequency - a.frequency)

  // Calculate sum of all frequencies
  const totalFreq = words.reduce((sum, word) => sum + word.frequency, 0)

  // Normalize frequencies to sum to 100%
  return words.map(word => ({
    ...word,
    formattedFreq: `${((word.frequency / totalFreq) * 100).toFixed(1)}%`
  }))
})
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
    <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
      {{ store.filteredWords.length === 1 ? '1 Possible Word' :
         store.filteredWords.length > 0 ? `${store.filteredWords.length} Possible Words` : '' }}
    </h2>

    <div v-if="tooManyMatches" class="text-gray-600 dark:text-gray-400 text-center">
      Too Many To List - Keep Guessing
    </div>
    <div v-else-if="store.filteredWords.length === 1"
      class="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-gray-400"
    >
      <div
        class="py-2 px-3 border-b border-gray-200 dark:border-gray-700
               text-gray-800 dark:text-gray-200 flex justify-between items-center w-full"
      >
        <span class="font-mono">{{ sortedWords[0].word }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ sortedWords[0].formattedFreq }}</span>
      </div>
      <div class="text-6xl animate-wobble animate-glow mt-8">🎉</div>
    </div>
    <div v-else-if="store.filteredWords.length === 0"
      class="flex flex-col items-center justify-center py-12 text-gray-600 dark:text-gray-400"
    >
      <div class="text-6xl animate-wobble animate-glow">😢</div>
      <div class="mt-4">No Words Match These Hints</div>
    </div>
    <div
      v-else
      class="max-h-[60vh] overflow-y-auto"
    >
      <div
        v-for="word in sortedWords"
        :key="word.word"
        class="py-2 px-3 border-b last:border-0 border-gray-200 dark:border-gray-700
               text-gray-800 dark:text-gray-200 flex justify-between items-center"
      >
        <span class="font-mono">{{ word.word }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ word.formattedFreq }}</span>
      </div>
    </div>
  </div>
</template>

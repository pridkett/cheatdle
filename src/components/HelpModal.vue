<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

defineExpose({ toggle, isOpen })
</script>

<template>
  <div>
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity z-40"
      @click="isOpen = false"
    />

    <!-- Modal -->
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 mx-auto max-w-2xl rounded-lg shadow-xl p-6 animate-slide-down"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">How to "Play"</h2>
          <button
            @click="toggle"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div class="space-y-4 text-gray-700 dark:text-gray-300">
          <p>If you're here it's probably because you suck at that word guessing game from the Grey Lady. That's okay, Cheatdle is here to help.</p>
          <p>Type in your guesses that you've made, hitting enter at the end of each line.</p>
          <p>Click on letters to cycle through colors:</p>
          <ul class="list-disc list-inside space-y-2">
            <li>Green: Letter is in the correct position</li>
            <li>Yellow: Letter exists but in wrong position</li>
            <li>Gray: Letter is not in the word</li>
          </ul>
          <p>The word list will update to show possible matches based on your hints.</p>
        </div>
      </div>
    </div>
  </div>
</template>

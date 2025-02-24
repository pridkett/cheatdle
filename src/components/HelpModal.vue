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
      class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
      @click="toggle"
    />
    
    <!-- Modal -->
    <div 
      v-if="isOpen"
      class="fixed inset-x-0 top-0 transform transition-transform duration-300 ease-in-out"
      :class="{ 'translate-y-0': isOpen, '-translate-y-full': !isOpen }"
    >
      <div class="bg-white dark:bg-gray-800 mx-auto max-w-2xl rounded-b-lg shadow-xl p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">How to Play</h2>
          <button 
            @click="toggle"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div class="space-y-4 text-gray-700 dark:text-gray-300">
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Board from './components/Board.vue'
import Keyboard from './components/Keyboard.vue'
import WordList from './components/WordList.vue'
import HelpModal from './components/HelpModal.vue'
import type { ComponentPublicInstance } from 'vue'

const helpModal = ref<ComponentPublicInstance<typeof HelpModal> | null>(null)
import { useWordleStore } from './stores/wordleStore'

const store = useWordleStore()

onMounted(() => {
  // Check system preference for dark mode
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark')
  }
  
  store.initializeGuesses()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <HelpModal ref="helpModal" />
    <header class="py-6 relative">
      <button
        @click="helpModal?.toggle()"
        class="absolute top-6 right-3 p-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
        title="Help"
      >
        ❔
      </button>
      <div class="container mx-auto px-4">
        <h1 class="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-title-shine tracking-tight transform hover:scale-110 transition-transform duration-200 cursor-default select-none" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.2);">
          CHEATDLE
        </h1>

        <div class="mt-6 flex justify-center">
          <div class="flex flex-col lg:flex-row items-start gap-8 justify-center">
            <div class="flex flex-col items-center">
              <Board class="mb-8" />
              <Keyboard
                class="mb-8 w-full max-w-2xl"
                @key-press="(key) => store.addLetter(key)"
                @enter-press="store.submitGuess"
                @backspace-press="store.removeLetter"
              />
            </div>

            <WordList class="w-full lg:w-[400px]" />
          </div>

        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Board from './components/Board.vue'
import Keyboard from './components/Keyboard.vue'
import WordList from './components/WordList.vue'
import HelpModal from './components/HelpModal.vue'
import type { ComponentPublicInstance } from 'vue'

const helpModal = ref<ComponentPublicInstance<typeof HelpModal> | null>(null)
import { useWordleStore } from './stores/wordleStore'

// const isDark = ref(document.documentElement.classList.contains('dark'))
const isDark = ref(false)
const store = useWordleStore()

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  // Check user preference in localStorage
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // If no preference is saved, use system preference
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // Apply the theme
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  store.initializeGuesses()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-all duration-300">
    <HelpModal ref="helpModal" />
    <header class="py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col items-center gap-4">
          <h1 class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-title-shine tracking-tight transform hover:scale-105 transition-transform duration-200 cursor-default select-none" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.2);">
            CHEATDLE
          </h1>
          <div class="flex gap-2">
            <button
              @click="toggleDark"
              class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Toggle dark mode"
            >
              {{ isDark ? '🌞' : '🌙' }}
            </button>
            <button
              @click="helpModal?.toggle()"
              class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              title="Help"
            >
              ❔
            </button>
          </div>
        </div>

        <div class="mt-6">
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

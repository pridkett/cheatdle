<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Board from './components/Board.vue'
import Keyboard from './components/Keyboard.vue'
import WordList from './components/WordList.vue'
import HelpModal from './components/HelpModal.vue'
import type { ComponentPublicInstance } from 'vue'

const helpModal = ref<ComponentPublicInstance<typeof HelpModal> | null>(null)
import { useWordleStore } from './stores/wordleStore'

const isDark = ref(false)
const store = useWordleStore()

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}

onMounted(() => {
  store.initializeGuesses()
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <HelpModal ref="helpModal" />
    <header class="py-6">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <img alt="Vue logo" class="w-32 h-32" src="@/assets/logo.svg" />
          
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

        <div class="mt-6 lg:grid lg:grid-cols-[1fr,300px] lg:gap-8">
          <div>
            <Board class="mb-8" />
            <Keyboard 
              class="mb-8"
              @key-press="(key) => store.addLetter(key)"
              @enter-press="store.submitGuess"
              @backspace-press="store.removeLetter"
            />
          </div>
          
          <aside class="mb-8 lg:mb-0">
            <WordList />
          </aside>
          
          <nav class="mt-4 space-x-4 lg:col-span-2">
            <RouterLink 
              to="/"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Home
            </RouterLink>
            <RouterLink 
              to="/about"
              class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              About
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

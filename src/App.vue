<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import Board from './components/Board.vue'
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
    <header class="py-6">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <img alt="Vue logo" class="w-32 h-32" src="@/assets/logo.svg" />
          
          <button 
            @click="toggleDark"
            class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ isDark ? '🌞' : '🌙' }}
          </button>
        </div>

        <div class="mt-6">
          <Board class="mb-8" />
          
          <nav class="mt-4 space-x-4">
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

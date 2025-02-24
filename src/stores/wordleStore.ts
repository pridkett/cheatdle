import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import wordlist from '../generatedWordlist'

export interface LetterGuess {
  letter: string
  color: 'grey' | 'yellow' | 'green' | 'empty'
}

export const useWordleStore = defineStore('wordle', () => {
  const activeRowIndex = ref(0)
  const guesses = ref<LetterGuess[][]>([])
  const filteredWords = ref(wordlist)

  function setActiveRowIndex(index: number) {
    activeRowIndex.value = index
  }

  function initializeGuesses() {
    guesses.value = Array(6).fill(null).map(() => 
      Array(5).fill(null).map(() => ({
        letter: '',
        color: 'empty'
      }))
    )
  }

  return {
    activeRowIndex,
    guesses,
    filteredWords,
    setActiveRowIndex,
    initializeGuesses
  }
})

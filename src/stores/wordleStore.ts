import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import wordlist from '../generatedWordlist'

export type GuessColor = 'white' | 'yellow' | 'green' | 'gray'

export interface LetterGuess {
  letter: string
  color: GuessColor
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
        color: 'white'
      }))
    )
  }

  function cycleColor(rowIndex: number, colIndex: number) {
    const currentColor = guesses.value[rowIndex][colIndex].color
    const colors: GuessColor[] = ['white', 'yellow', 'green', 'gray']
    const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length
    guesses.value[rowIndex][colIndex].color = colors[nextColorIndex]
    updateConstraints()
  }

  function updateConstraints() {
    // Placeholder for constraint logic
    // This will be expanded in the next implementation phase
    const currentGuess = guesses.value[activeRowIndex.value]
    const letterCounts = new Map<string, number>()
    
    // Count letters marked as green or yellow
    currentGuess.forEach(guess => {
      if (guess.color === 'green' || guess.color === 'yellow') {
        const count = letterCounts.get(guess.letter) || 0
        letterCounts.set(guess.letter, count + 1)
      }
    })
  }

  function addLetter(letter: string) {
    const currentRow = guesses.value[activeRowIndex.value]
    const emptyIndex = currentRow.findIndex(g => g.letter === '')
    if (emptyIndex !== -1) {
      currentRow[emptyIndex].letter = letter
    }
  }

  function removeLetter() {
    const currentRow = guesses.value[activeRowIndex.value]
    for (let i = currentRow.length - 1; i >= 0; i--) {
      if (currentRow[i].letter !== '') {
        currentRow[i].letter = ''
        break
      }
    }
  }

  function submitGuess() {
    if (activeRowIndex.value < 5) {
      activeRowIndex.value++
    }
  }

  return {
    activeRowIndex,
    guesses,
    filteredWords,
    setActiveRowIndex,
    initializeGuesses,
    addLetter,
    removeLetter,
    submitGuess,
    cycleColor
  }
})

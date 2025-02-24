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

  function filterWordsBasedOnGuesses() {
    const constraints = {
      exact: new Array(5).fill(''),  // Green positions
      excluded: new Array(5).fill(''), // Yellow positions (letter can't be here)
      required: new Map<string, number>(), // Minimum count of each letter
      forbidden: new Set<string>(), // Letters that can't appear more than required
    }

    // Analyze all guesses to build constraints
    guesses.value.forEach(row => {
      const letterCounts = new Map<string, number>()
      
      // First pass: count letters and handle green positions
      row.forEach((guess, pos) => {
        if (guess.letter) {
          letterCounts.set(guess.letter, (letterCounts.get(guess.letter) || 0) + 1)
          if (guess.color === 'green') {
            constraints.exact[pos] = guess.letter
            const count = constraints.required.get(guess.letter) || 0
            constraints.required.set(guess.letter, Math.max(count, letterCounts.get(guess.letter) || 0))
          }
        }
      })

      // Second pass: handle yellow and gray
      row.forEach((guess, pos) => {
        if (guess.letter) {
          if (guess.color === 'yellow') {
            constraints.excluded[pos] = guess.letter
            const count = constraints.required.get(guess.letter) || 0
            constraints.required.set(guess.letter, Math.max(count, letterCounts.get(guess.letter) || 0))
          } else if (guess.color === 'gray') {
            // Only mark as forbidden if not required by green/yellow
            if (!constraints.required.has(guess.letter)) {
              constraints.forbidden.add(guess.letter)
            }
          }
        }
      })
    })

    // Filter wordlist based on constraints
    filteredWords.value = wordlist.filter(entry => {
      const word = entry.word.toLowerCase()
      
      // Check exact positions (green)
      for (let i = 0; i < 5; i++) {
        if (constraints.exact[i] && word[i] !== constraints.exact[i]) {
          return false
        }
      }

      // Check excluded positions (yellow)
      for (let i = 0; i < 5; i++) {
        if (constraints.excluded[i] && word[i] === constraints.excluded[i]) {
          return false
        }
      }

      // Check required letters and their counts
      for (const [letter, count] of constraints.required) {
        if ((word.match(new RegExp(letter, 'g')) || []).length < count) {
          return false
        }
      }

      // Check forbidden letters
      for (const letter of constraints.forbidden) {
        if (word.includes(letter)) {
          return false
        }
      }

      return true
    })
  }

  function updateConstraints() {
    filterWordsBasedOnGuesses()
  }

  function addLetter(letter: string) {
    const currentRow = guesses.value[activeRowIndex.value]
    const emptyIndex = currentRow.findIndex(g => g.letter === '')
    if (emptyIndex !== -1 && emptyIndex < 5) {
      currentRow[emptyIndex].letter = letter.toUpperCase()
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
    cycleColor,
    filterWordsBasedOnGuesses
  }
})

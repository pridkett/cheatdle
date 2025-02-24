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
        color: 'gray'
      }))
    )
  }

  function cycleColor(rowIndex: number, colIndex: number) {
    const currentColor = guesses.value[rowIndex][colIndex].color
    const colors: GuessColor[] = ['gray', 'yellow', 'green']
    const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length
    guesses.value[rowIndex][colIndex].color = colors[nextColorIndex]
    updateConstraints()
  }

  function filterWordsBasedOnGuesses() {
    // Filter wordlist based on all guesses
    filteredWords.value = wordlist.filter(entry => {
      const word = entry.word.toLowerCase()

      // Check against each row of guesses
      for (const row of guesses.value) {
        // Skip empty rows
        if (row.every(g => g.letter === '')) continue

        // Only process rows that have some letters
        if (row.some(g => g.letter !== '')) {
          for (let i = 0; i < 5; i++) {
            const guess = row[i]
            if (!guess.letter) continue

            const letter = guess.letter.toLowerCase()

            switch (guess.color) {
              case 'green':
                // Letter must be in this exact position
                if (word[i] !== letter) {
                  return false
                }
                break

              case 'yellow':
                // Letter must exist somewhere, but not in this position
                if (word[i] === letter) {
                  return false
                }
                if (!word.includes(letter)) {
                  return false
                }
                break

              case 'gray':
                // Letter should not appear in the word at all
                if (word.includes(letter)) {
                  return false
                }
                break
            }
          }
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

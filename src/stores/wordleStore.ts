import { defineStore } from 'pinia'
import { ref } from 'vue'
import wordlist from '../generatedWordlist'
import { logger, LogLevel } from '../utils/logger'

// Set desired log level
logger.setLevel(LogLevel.INFO)

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
    // Only allow color changes if there's a letter in the box
    if (guesses.value[rowIndex][colIndex].letter === '') {
      return
    }
    const currentColor = guesses.value[rowIndex][colIndex].color
    const colors: GuessColor[] = ['gray', 'yellow', 'green']
    const nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length
    guesses.value[rowIndex][colIndex].color = colors[nextColorIndex]
    updateConstraints()
  }

  function processRow(row: LetterGuess[], currentWords: typeof wordlist) {
    if (row.some(g => g.letter === '')) return currentWords;

    // Track colored and gray instances of letters
    const minLetters = new Map<string, number>();
    const maxLetters = new Map<string, number>();

    const positions = Array(5).fill('.');
    const notInPosition = Array(5).fill(null).map(() => new Set<string>());
    const mustNotContain = new Set<string>();

    // Second pass: build position constraints
    row.forEach((guess, pos) => {
      if (!guess.letter) return;
      const letter = guess.letter.toLowerCase();

      switch (guess.color) {
        case 'green':
          positions[pos] = letter;
          minLetters.set(letter, (minLetters.get(letter) || 0) + 1);
          break;
        case 'yellow':
          notInPosition[pos].add(letter);
          minLetters.set(letter, (minLetters.get(letter) || 0) + 1);
          break;
        case 'gray':
          if (!minLetters.has(letter)) {
            mustNotContain.add(letter);
          } else {
            maxLetters.set(letter, 1);
          }
          break;
      }
    });

    // Iterate over the keys of maxLetters setting their values to minLetters[key]
    maxLetters.forEach((_, key) => {
      if (minLetters.has(key)) {
      maxLetters.set(key, minLetters.get(key)!)
      }
    });

    // Combine minLetters and maxLetters into a single map for mixed letters
    const mixedLetters = new Map<string, number>();
    minLetters.forEach((value, key) => {
      mixedLetters.set(key, value);
    });
    maxLetters.forEach((value, key) => {
      mixedLetters.set(key, value);
    });
    // Build regex pattern for this row
    const pattern = '^' + positions.map((pos, i) => {
      if (pos !== '.') return pos;
      const excluded = new Set([...notInPosition[i], ...mustNotContain]);
      return excluded.size > 0 ? `[^${Array.from(excluded).join('')}]` : '.';
    }).join('') + '$';

    // logger.info('Row pattern:', pattern);
    // logger.info('Mixed letters:', mixedLetters);
    const regex = new RegExp(pattern);

    // Filter words based on this row's constraints
    return currentWords.filter(entry => {
      const word = entry.word.toLowerCase();

      // logger.info('Checking word:', word, ' result: ', regex.test(word));
      // Check regex pattern
      if (!regex.test(word)) return false;

      // Check exact letter counts for mixed letters
      for (const [letter, requiredCount] of minLetters) {
        const actualCount = (word.match(new RegExp(letter, 'g')) || []).length;
        if (actualCount < requiredCount) {
          // logger.debug(`Word "${word}": has ${actualCount} ${letter}'s, needs ${requiredCount}`);
          return false;
        }
      }

      // Check exact letter counts for mixed letters
      for (const [letter, requiredCount] of maxLetters) {
        const actualCount = (word.match(new RegExp(letter, 'g')) || []).length;
        if (actualCount > requiredCount) {
          logger.debug(`Word "${word}": has ${actualCount} ${letter}'s, needs = ${requiredCount}`);
          return false;
        }
      }

      return true;
    });
  }

  function filterWordsBasedOnGuesses() {
    // Start with full word list and filter through each row
    filteredWords.value = guesses.value.reduce((words, row) => {
      return processRow(row, words);
    }, wordlist);
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
    // Check if current row is empty and we're not on the first row
    if (currentRow.every(g => g.letter === '') && activeRowIndex.value > 0) {
      // Move to previous row
      activeRowIndex.value--
      return
    }

    // Remove letter from current row
    for (let i = currentRow.length - 1; i >= 0; i--) {
      if (currentRow[i].letter !== '') {
        currentRow[i].letter = ''
        currentRow[i].color = 'gray'  // Reset color to gray
        filterWordsBasedOnGuesses()  // Reprocess immediately when any letter is removed
        break
      }
    }
  }

  function submitGuess() {
    if (activeRowIndex.value < 5) {
      activeRowIndex.value++
      filterWordsBasedOnGuesses()
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

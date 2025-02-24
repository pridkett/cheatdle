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

  function filterWordsBasedOnGuesses() {
    // Process all guesses to build constraints
    const positions = Array(5).fill('.');  // Default pattern for each position
    const mustContain = new Set<string>();  // Letters that must be in the word
    const mustNotContain = new Set<string>();  // Letters that must not be in the word
    const notInPosition = Array(5).fill(new Set<string>());  // Letters that can't be in specific positions

    // Initialize notInPosition with new Sets
    for (let i = 0; i < 5; i++) {
      notInPosition[i] = new Set<string>();
    }

    // Process each row of guesses
    for (const row of guesses.value) {
      // Skip empty rows
      if (row.every(g => g.letter === '')) continue;

      // Process each letter in the row
      row.forEach((guess, pos) => {
        if (!guess.letter) return;
        
        const letter = guess.letter.toLowerCase();
        
        switch (guess.color) {
          case 'green':
            positions[pos] = letter;  // Must be this letter in this position
            mustContain.add(letter);  // Must contain this letter
            break;
          
          case 'yellow':
            notInPosition[pos].add(letter);  // Can't be this letter in this position
            mustContain.add(letter);  // Must contain this letter somewhere
            break;
          
          case 'gray':
            // Only add to mustNotContain if it's not required by a green or yellow
            if (!mustContain.has(letter)) {
              mustNotContain.add(letter);
            }
            break;
        }
      });
    }

    // Build position patterns
    const positionPatterns = positions.map((pos, i) => {
      if (pos !== '.') {
        return pos;  // Green letter - must be exactly this
      }
      // Combine position-specific exclusions with global must-not-contain letters
      const excluded = new Set([
        ...Array.from(notInPosition[i]),
        ...Array.from(mustNotContain)
      ]);
      return excluded.size > 0 ? `[^${Array.from(excluded).join('')}]` : '.';
    });

    // Build the complete regex pattern
    const pattern = `^${positionPatterns.join('')}$`;
    const regex = new RegExp(pattern);

    // Debug logging
    console.log('Position patterns:', positionPatterns);
    console.log('Must contain letters:', Array.from(mustContain));
    console.log('Must not contain letters:', Array.from(mustNotContain));
    console.log('Final regex pattern:', pattern);

    // Filter words based on regex and must-contain constraints
    filteredWords.value = wordlist.filter(entry => {
      const word = entry.word.toLowerCase();
      
      // Check the regex pattern which handles position and must-not-contain constraints
      const regexMatch = regex.test(word);
      if (!regexMatch) {
        console.log(`${word}: failed regex pattern ${pattern}`);
        return false;
      }

      // Check if word contains all required letters
      for (const letter of mustContain) {
        if (!word.includes(letter)) {
          console.log(`${word}: missing required letter ${letter}`);
          return false;
        }
      }

      console.log(`${word}: PASSED all filters`);
      return true;
    });
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

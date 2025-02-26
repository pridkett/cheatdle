import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWordleStore } from '@/stores/wordleStore'
import { WordEntry } from '@/generatedWordlist'

describe('Wordle Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default values', () => {
    const store = useWordleStore()
    expect(store.activeRowIndex).toBe(0)
    expect(store.guesses).toEqual([])
    expect(store.filteredWords.length).toBeGreaterThan(0)
  })

  it('sets active row index', () => {
    const store = useWordleStore()
    store.setActiveRowIndex(2)
    expect(store.activeRowIndex).toBe(2)
  })

  it('initializes guesses with correct structure', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    expect(store.guesses).toHaveLength(6) // 6 rows
    expect(store.guesses[0]).toHaveLength(5) // 5 letters per row

    // Check structure of a single letter guess
    const firstLetter = store.guesses[0][0]
    expect(firstLetter).toEqual({
      letter: '',
      color: 'gray'
    })
  })

  it('cycles colors correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Test color cycling
    // must have a letter set to cycle colors
    store.guesses[0][0].letter = 'A'
    expect(store.guesses[0][0].color).toBe('gray')

    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('yellow')

    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('green')

    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('gray')

    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('yellow')
  })

  it('filters words based on green positions', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Set up a guess with green T in first position
    store.guesses[0][0].letter = 'T'
    store.guesses[0][0].color = 'green'
    store.guesses[0][1].letter = 'Q'
    store.guesses[0][1].color = 'gray'
    store.guesses[0][2].letter = 'Q'
    store.guesses[0][2].color = 'gray'
    store.guesses[0][3].letter = 'Q'
    store.guesses[0][3].color = 'gray'
    store.guesses[0][4].letter = 'Q'
    store.guesses[0][4].color = 'gray'
    store.filterWordsBasedOnGuesses()

    // All remaining words should start with T
    expect(store.filteredWords.every(word => word.word.toLowerCase().startsWith('t'))).toBe(true)
  })

  it('handles repeated letters correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Set up a guess with three E's - one green, one yellow, one gray
    store.guesses[0][0].letter = 'A'
    store.guesses[0][0].color = 'gray'
    store.guesses[0][1].letter = 'E'
    store.guesses[0][1].color = 'green'
    store.guesses[0][2].letter = 'A'
    store.guesses[0][2].color = 'gray'
    store.guesses[0][3].letter = 'E'
    store.guesses[0][3].color = 'yellow'
    store.guesses[0][4].letter = 'E'
    store.guesses[0][4].color = 'gray'

    store.filterWordsBasedOnGuesses()

    // Words should have exactly two E's, one in position 1
    expect(store.filteredWords.every(word => {
      const eCount = (word.word.match(/e/g) || []).length
      return eCount === 2 && word.word[1] === 'e' && word.word[3] !== 'e'
    })).toBe(true)
  })

  it('enforces exact letter count when letter appears as both colored and gray', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Set up a guess with three E's - one green, one yellow, one gray
    // This should mean words must have exactly two E's
    store.guesses[0][0].letter = 'E'
    store.guesses[0][0].color = 'green'
    store.guesses[0][1].letter = 'Z'
    store.guesses[0][1].color = 'gray'
    store.guesses[0][2].letter = 'E'
    store.guesses[0][2].color = 'yellow'
    store.guesses[0][3].letter = 'Z'
    store.guesses[0][3].color = 'gray'
    store.guesses[0][4].letter = 'E'
    store.guesses[0][4].color = 'gray'
    store.filterWordsBasedOnGuesses()

    // Words must have exactly two E's
    expect(store.filteredWords.every(word => {
      const eCount = (word.word.toLowerCase().match(/e/g) || []).length
      return eCount === 2 && word.word.toLowerCase()[0] === 'e' && word.word.toLowerCase()[2] !== 'e'
    })).toBe(true)
  })

  it('handles all gray repeated letters correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Set up a guess with two A's - both gray
    store.guesses[0][0].letter = 'A'
    store.guesses[0][0].color = 'gray'
    store.guesses[0][1].letter = '.'
    store.guesses[0][1].color = 'gray'
    store.guesses[0][2].letter = 'A'
    store.guesses[0][2].color = 'gray'
    store.guesses[0][3].letter = '.'
    store.guesses[0][3].color = 'gray'
    store.guesses[0][4].letter = '.'
    store.guesses[0][4].color = 'gray'

    store.filterWordsBasedOnGuesses()

    // Words should not contain any A's
    expect(store.filteredWords.every(word => !word.word.includes('a'))).toBe(true)
  })

  it('handles yellow constraints correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Set up yellow A not in position 0
    store.guesses[0][0].letter = 'A'
    store.guesses[0][0].color = 'yellow'
    store.guesses[0][1].letter = 'Q'
    store.guesses[0][1].color = 'gray'
    store.guesses[0][2].letter = 'Q'
    store.guesses[0][2].color = 'gray'
    store.guesses[0][3].letter = 'Q'
    store.guesses[0][3].color = 'gray'
    store.guesses[0][4].letter = 'Q'
    store.guesses[0][4].color = 'gray'
    store.filterWordsBasedOnGuesses()

    // Words should contain A but not in first position
    expect(store.filteredWords.every(word => {
      // console.log(word)
      return word.word.includes('a') && word.word[0] !== 'a'
    })).toBe(true)
  })

  it('handles multi-line constraints correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Set up yellow A not in position 0
    store.guesses[0][0].letter = 'T'
    store.guesses[0][0].color = 'gray'
    store.guesses[0][1].letter = 'A'
    store.guesses[0][1].color = 'yellow'
    store.guesses[0][2].letter = 'C'
    store.guesses[0][2].color = 'gray'
    store.guesses[0][3].letter = 'O'
    store.guesses[0][3].color = 'gray'
    store.guesses[0][4].letter = 'S'
    store.guesses[0][4].color = 'yellow'

    store.guesses[1][0].letter = 'R'
    store.guesses[1][0].color = 'gray'
    store.guesses[1][1].letter = 'E'
    store.guesses[1][1].color = 'yellow'
    store.guesses[1][2].letter = 'G'
    store.guesses[1][2].color = 'gray'
    store.guesses[1][3].letter = 'A'
    store.guesses[1][3].color = 'green'
    store.guesses[1][4].letter = 'L'
    store.guesses[1][4].color = 'gray'

    store.guesses[2][0].letter = 'S'
    store.guesses[2][0].color = 'yellow'
    store.guesses[2][1].letter = 'P'
    store.guesses[2][1].color = 'gray'
    store.guesses[2][2].letter = 'E'
    store.guesses[2][2].color = 'yellow'
    store.guesses[2][3].letter = 'A'
    store.guesses[2][3].color = 'green'
    store.guesses[2][4].letter = 'K'
    store.guesses[2][4].color = 'gray'

    store.filterWordsBasedOnGuesses()

    expect(store.filteredWords.length).toEqual(3)
    expect(store.filteredWords[0].word).toEqual('essay')
    expect(store.filteredWords[1].word).toEqual('ansae')
    expect(store.filteredWords[2].word).toEqual('isnae')
  })

  it.skip('updates filtered words when colors change', () => {
    const store = useWordleStore()
    store.initializeGuesses()

    // Add some letters and set colors directly
    store.guesses[0][0].letter = 'A'
    store.guesses[0][0].color = 'yellow'
    store.filterWordsBasedOnGuesses()
    const yellowCount = store.filteredWords.length

    store.guesses[0][0].color = 'green'
    store.filterWordsBasedOnGuesses()
    const greenCount = store.filteredWords.length

    // Different constraints should yield different filtered sets
    // Yellow A means "contains A but not in first position"
    // Green A means "must start with A"
    // These should produce different word counts
    // Our word list has 'audio' starting with A, but 'trace', 'stare', 'raise' containing A elsewhere
    expect(yellowCount).toBeGreaterThan(greenCount)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useWordleStore } from '@/stores/wordleStore'

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
      color: 'white'
    })
  })

  it('cycles colors correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()
    
    // Test color cycling
    expect(store.guesses[0][0].color).toBe('white')
    
    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('yellow')
    
    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('green')
    
    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('gray')
    
    store.cycleColor(0, 0)
    expect(store.guesses[0][0].color).toBe('white')
  })

  it('filters words based on green positions', () => {
    const store = useWordleStore()
    store.initializeGuesses()
    
    // Set up a guess with green T in first position
    store.guesses[0][0].letter = 'T'
    store.guesses[0][0].color = 'green'
    store.filterWordsBasedOnGuesses()
    
    // All remaining words should start with T
    expect(store.filteredWords.every(word => word.word.startsWith('t'))).toBe(true)
  })

  it('handles repeated letters correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()
    
    // Set up a guess with two O's - one green, one gray
    store.guesses[0][1].letter = 'O'
    store.guesses[0][1].color = 'green'
    store.guesses[0][3].letter = 'O'
    store.guesses[0][3].color = 'gray'
    store.filterWordsBasedOnGuesses()
    
    // Words should have exactly one O in position 1
    expect(store.filteredWords.every(word => {
      const oCount = (word.word.match(/o/g) || []).length
      return oCount === 1 && word.word[1] === 'o'
    })).toBe(true)
  })

  it('handles yellow constraints correctly', () => {
    const store = useWordleStore()
    store.initializeGuesses()
    
    // Set up yellow A not in position 0
    store.guesses[0][0].letter = 'A'
    store.guesses[0][0].color = 'yellow'
    store.filterWordsBasedOnGuesses()
    
    // Words should contain A but not in first position
    expect(store.filteredWords.every(word => 
      word.word.includes('a') && word.word[0] !== 'a'
    )).toBe(true)
  })

  it('updates filtered words when colors change', () => {
    const store = useWordleStore()
    store.initializeGuesses()
    
    // Add some letters and cycle colors
    store.guesses[0][0].letter = 'T'
    store.cycleColor(0, 0) // white -> yellow
    
    const yellowCount = store.filteredWords.length
    
    store.cycleColor(0, 0) // yellow -> green
    const greenCount = store.filteredWords.length
    
    // Different constraints should yield different filtered sets
    expect(yellowCount).not.toBe(greenCount)
  })
})

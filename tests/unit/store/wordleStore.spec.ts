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
      color: 'empty'
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

  it('updates constraints when colors change', () => {
    const store = useWordleStore()
    store.initializeGuesses()
    
    // Add some letters
    store.guesses[0][0].letter = 'T'
    store.guesses[0][1].letter = 'A'
    
    // Change colors and verify constraints update
    store.cycleColor(0, 0) // T -> yellow
    store.cycleColor(0, 1) // A -> yellow
    
    // For now, just verify the function doesn't throw
    // In the next phase, we'll add actual constraint checking
    expect(() => store.cycleColor(0, 0)).not.toThrow()
  })
})

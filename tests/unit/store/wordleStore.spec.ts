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
})

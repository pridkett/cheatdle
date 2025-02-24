import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Board from '@/components/Board.vue'
import { useWordleStore } from '@/stores/wordleStore'

describe('Board', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const store = useWordleStore()
    store.initializeGuesses()
  })

  it('renders 6 rows and 5 columns', () => {
    const wrapper = mount(Board)
    
    // Check rows
    const rows = wrapper.findAll('.grid-rows-6 > div')
    expect(rows).toHaveLength(6)
    
    // Check columns in first row
    const firstRowCells = rows[0].findAll('.grid-cols-5 > div')
    expect(firstRowCells).toHaveLength(5)
  })

  it('displays letters from store', () => {
    const store = useWordleStore()
    store.guesses[0][0].letter = 'T'
    store.guesses[0][1].letter = 'A'
    store.guesses[0][2].letter = 'C'
    store.guesses[0][3].letter = 'O'
    store.guesses[0][4].letter = 'S'
    
    const wrapper = mount(Board)
    const firstRowCells = wrapper.findAll('.grid-rows-6 > div').at(0)?.findAll('.grid-cols-5 > div')
    
    expect(firstRowCells?.[0].text()).toBe('T')
    expect(firstRowCells?.[1].text()).toBe('E')
    expect(firstRowCells?.[2].text()).toBe('S')
    expect(firstRowCells?.[3].text()).toBe('T')
    expect(firstRowCells?.[4].text()).toBe('')
  })
})

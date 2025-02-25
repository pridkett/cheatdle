import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import WordList from '@/components/WordList.vue'
import { useWordleStore } from '@/stores/wordleStore'

describe('WordList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows too many matches message when filtered words >= 1000', () => {
    const store = useWordleStore()
    // Create 100 dummy words
    store.filteredWords = Array(1000).fill(null).map((_, i) => ({
      word: `word${i}`,
      frequency: i
    }))

    const wrapper = mount(WordList)
    expect(wrapper.text()).toContain('1000 Possible Words')
    expect(wrapper.text()).toContain('Keep Guessing')
  })

  it('displays words sorted by frequency', () => {
    const store = useWordleStore()
    store.filteredWords = [
      { word: 'low', frequency: 10 },
      { word: 'high', frequency: 100 },
      { word: 'mid', frequency: 50 }
    ]

    const wrapper = mount(WordList)
    const words = wrapper.findAll('.font-mono')
    expect(words[0].text()).toBe('high')
    expect(words[1].text()).toBe('mid')
    expect(words[2].text()).toBe('low')
  })
})

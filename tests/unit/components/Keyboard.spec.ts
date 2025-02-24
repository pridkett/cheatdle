import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Keyboard from '@/components/Keyboard.vue'

describe('Keyboard', () => {
  it('renders all keyboard rows', () => {
    const wrapper = mount(Keyboard)
    const rows = wrapper.findAll('.flex.justify-center')
    expect(rows).toHaveLength(3)
  })

  it('emits key-press event when letter is clicked', async () => {
    const wrapper = mount(Keyboard)
    const aKey = wrapper.findAll('button').find(b => b.text() === 'A')
    await aKey?.trigger('click')
    
    expect(wrapper.emitted('key-press')?.[0]).toEqual(['A'])
  })

  it('emits enter-press event when ENTER is clicked', async () => {
    const wrapper = mount(Keyboard)
    const enterKey = wrapper.findAll('button').find(b => b.text() === 'ENTER')
    await enterKey?.trigger('click')
    
    expect(wrapper.emitted('enter-press')).toBeTruthy()
  })

  it('emits backspace-press event when backspace is clicked', async () => {
    const wrapper = mount(Keyboard)
    const backspaceKey = wrapper.findAll('button').find(b => b.text() === '⌫')
    await backspaceKey?.trigger('click')
    
    expect(wrapper.emitted('backspace-press')).toBeTruthy()
  })
})

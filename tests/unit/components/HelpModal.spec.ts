import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelpModal from '@/components/HelpModal.vue'

describe('HelpModal', () => {
  it('starts closed', () => {
    const wrapper = mount(HelpModal)
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('opens and closes when toggled', async () => {
    const wrapper = mount(HelpModal)
    
    // Open modal
    await wrapper.vm.toggle()
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
    
    // Close modal
    await wrapper.vm.toggle()
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })

  it('closes when backdrop is clicked', async () => {
    const wrapper = mount(HelpModal)
    
    await wrapper.vm.toggle()
    await wrapper.find('.fixed.inset-0').trigger('click')
    
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(false)
  })
})

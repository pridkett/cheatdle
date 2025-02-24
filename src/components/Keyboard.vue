<script setup lang="ts">
const emit = defineEmits<{
  'key-press': [key: string]
  'enter-press': []
  'backspace-press': []
}>()

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
]

const handleKeyClick = (key: string) => {
  if (key === 'ENTER') {
    emit('enter-press')
  } else if (key === '⌫') {
    emit('backspace-press')
  } else {
    emit('key-press', key)
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="flex justify-center gap-1">
      <button
        v-for="key in row"
        :key="key"
        @click="handleKeyClick(key)"
        class="px-3 py-4 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
               text-gray-800 dark:text-gray-200 font-semibold transition-colors
               min-w-[2.5rem]"
        :class="{
          'px-4': key === 'ENTER' || key === '⌫'
        }"
      >
        {{ key }}
      </button>
    </div>
  </div>
</template>

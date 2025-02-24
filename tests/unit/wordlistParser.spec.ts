import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '../..')

describe('Word List Parser', () => {
  beforeAll(() => {
    // Copy sample CSV to project root
    const sampleContent = readFileSync(join(__dirname, '../fixtures/sample-words.csv'))
    writeFileSync(join(projectRoot, 'word-list.csv'), sampleContent)
  })

  afterAll(() => {
    // Clean up test files
    unlinkSync(join(projectRoot, 'word-list.csv'))
  })

  it('generates correct TypeScript output', async () => {
    // Run the parser script
    execSync('node scripts/parse-csv.js', { cwd: projectRoot })

    // Import the generated file
    const { default: wordList } = await import('../../src/generatedWordlist')

    // Verify the content
    expect(wordList).toHaveLength(3)
    expect(wordList[0]).toEqual({ word: 'hello', frequency: 1000 })
    expect(wordList[1]).toEqual({ word: 'world', frequency: 500 })
    expect(wordList[2]).toEqual({ word: 'test', frequency: 250 })
  })
})

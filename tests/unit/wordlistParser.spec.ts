import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { readFileSync, writeFileSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '../..')
const wordListSourceFile = "word-list.tsv"
const wordListOutputFile = "generatedWordList.test.ts"

describe('Word List Parser', () => {
  beforeAll(() => {
    // Copy sample CSV to project root
    const sampleContent = readFileSync(join(__dirname, '../fixtures/sample-words.csv'))
    writeFileSync(join(projectRoot, wordListSourceFile), sampleContent)
  })

  afterAll(() => {
    // Clean up test files
    unlinkSync(join(projectRoot, wordListSourceFile))
    try {
      unlinkSync(join(projectRoot, 'src', wordListOutputFile))
    } catch (e) {
      // File might not exist if test failed
    }
  })

  it('generates correct TypeScript output', () => {
    // Run the parser script
    execSync(`node scripts/parse-csv.js ${wordListSourceFile} ${wordListOutputFile}`, { cwd: projectRoot })

    // Read the generated file
    const generatedContent = readFileSync(
      join(projectRoot, 'src', wordListOutputFile),
      'utf-8'
    )

    // Verify the content contains expected data
    expect(generatedContent).toContain('"word": "hello"')
    expect(generatedContent).toContain('"frequency": 1')
    expect(generatedContent).toContain('"word": "world"')
    expect(generatedContent).toContain('"frequency": 0.5')
    expect(generatedContent).toContain('"word": "tacos"')
    expect(generatedContent).toContain('"frequency": 0.25')

    // Verify TypeScript interface is present
    expect(generatedContent).toContain('export interface WordEntry {')
    expect(generatedContent).toContain('word: string')
    expect(generatedContent).toContain('frequency: number')
  })
})

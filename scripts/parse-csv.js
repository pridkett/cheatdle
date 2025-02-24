import { parse } from 'csv-parse/sync'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

try {
  // Read the CSV file
  const csvContent = readFileSync(join(projectRoot, 'word-list.csv'), 'utf-8')
  
  // Parse CSV content
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  })

  // Transform and sort records
  const wordList = records
    .map(record => ({
      word: record.word.toLowerCase(),
      frequency: parseInt(record.frequency, 10)
    }))
    .sort((a, b) => b.frequency - a.frequency)

  // Generate TypeScript file content
  const tsContent = `// Generated file - do not edit directly
export interface WordEntry {
  word: string
  frequency: number
}

const wordList: WordEntry[] = ${JSON.stringify(wordList, null, 2)}

export default wordList
`

  // Write the TypeScript file
  writeFileSync(join(projectRoot, 'src', 'generatedWordlist.ts'), tsContent)
  console.log('Successfully generated wordlist')

} catch (error) {
  console.error('Error processing word list:', error)
  process.exit(1)
}

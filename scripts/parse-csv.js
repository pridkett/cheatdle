import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// Get input filename from command line args, default to google-words.txt
const inputFile = process.argv[2] || 'words.txt'
const outputFile = process.argv[3] || 'generatedWordlist.ts'

try {
  // Read the input file
  const content = readFileSync(join(projectRoot, inputFile), 'utf-8')

  // Parse the file content (assuming space/tab separated values)
  const records = content
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const [word, freq] = line.trim().split(/\s+/)
      return {
        word: word.trim(),
        frequency: parseInt(freq || '0', 10)
      }
    })
    .filter(record => record.word.length === 5)

  // Find max frequency for normalization
  const maxFreq = Math.max(...records.map(r => r.frequency))

  // Transform and sort records
  const wordList = records
    .map(record => ({
      word: record.word.toLowerCase(),
      frequency: maxFreq > 0 ? record.frequency / maxFreq : 0
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
  writeFileSync(join(projectRoot, 'src', outputFile), tsContent)
  console.log('Successfully generated wordlist')

} catch (error) {
  console.error('Error processing word list:', error)
  process.exit(1)
}

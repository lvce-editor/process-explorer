import { readFileSync, writeFileSync } from 'node:fs'

interface ReplaceOptions {
  readonly path: string
  readonly occurrence: string
  readonly replacement: string
}

export const replace = ({ path, occurrence, replacement }: ReplaceOptions): void => {
  const oldContent = readFileSync(path, 'utf8')
  const newContent = oldContent.replaceAll(occurrence, replacement)
  writeFileSync(path, newContent)
}

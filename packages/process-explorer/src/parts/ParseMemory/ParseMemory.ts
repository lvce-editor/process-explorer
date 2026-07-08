import * as Character from '../Character/Character.ts'

export const parseMemory = (content: string): number => {
  const trimmedContent = content.trim()
  const numberBlocks = trimmedContent.split(Character.Space)
  const pageSize = 4096
  const rss = Number.parseInt(numberBlocks[1]) * pageSize
  return rss
}

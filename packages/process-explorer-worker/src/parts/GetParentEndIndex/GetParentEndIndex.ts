import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getParentEndIndex = (dirents: readonly ExplorerItem[], index: number): number => {
  const dirent = dirents[index]
  const { depth } = dirent
  let endIndex = index + 1
  while (endIndex < dirents.length && dirents[endIndex].depth > depth) {
    endIndex++
  }
  return endIndex
}

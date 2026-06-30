import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const getParentStartIndex = (dirents: readonly ExplorerItem[], index: number): number => {
  const dirent = dirents[index]
  let startIndex = index - 1
  while (startIndex >= 0 && dirents[startIndex].depth >= dirent.depth) {
    startIndex--
  }
  return startIndex
}

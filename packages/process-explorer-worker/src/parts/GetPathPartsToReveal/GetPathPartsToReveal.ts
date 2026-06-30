import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { PathPart } from '../PathPart/PathPart.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'

export const getPathPartsToReveal = (root: string, pathParts: readonly PathPart[], dirents: readonly ExplorerItem[]): readonly PathPart[] => {
  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i]
    const index = getIndex(dirents, pathPart.path)
    if (index === -1) {
      continue
    }
    return pathParts.slice(i)
  }
  return pathParts
}

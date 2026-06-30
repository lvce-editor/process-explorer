import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'

export const sortPathDirentsMap = (map: Record<string, readonly RawDirent[]>): Record<string, readonly RawDirent[]> => {
  const sortedMap: Record<string, readonly RawDirent[]> = Object.create(null)
  for (const [key, value] of Object.entries(map)) {
    const sorted = SortExplorerItems.sortExplorerItems(value)
    sortedMap[key] = sorted
  }
  return sortedMap
}

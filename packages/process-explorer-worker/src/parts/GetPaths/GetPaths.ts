import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { getPath } from '../GetPath/GetPath.ts'

export const getPaths = (items: readonly ExplorerItem[]): readonly string[] => {
  return items.map(getPath)
}

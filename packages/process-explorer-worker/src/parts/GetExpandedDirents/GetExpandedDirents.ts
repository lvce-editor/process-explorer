import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { isExpanded } from '../IsExpanded/IsExpanded.ts'

export const getExpandedDirents = (items: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  return items.filter(isExpanded)
}

import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import { treeToArrayInternal } from '../TreeToArrayInternal/TreeToArrayInternal.ts'

export const treeToArray = (map: Tree, root: string): readonly ExplorerItem[] => {
  const items: ExplorerItem[] = []
  treeToArrayInternal(map, root, items, '', 1)
  return items
}

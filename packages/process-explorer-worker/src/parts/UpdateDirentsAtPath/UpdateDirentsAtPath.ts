import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import { join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'

export const updateDirentsAtPath = (
  items: readonly ExplorerItem[],
  path: string,
  root: string,
  newDirents: readonly RawDirent[],
): readonly ExplorerItem[] => {
  const sortedDirents = newDirents
    .map((dirent, index) => ({
      depth: 0, // TODO
      icon: '',
      name: dirent.name,
      path: join2(path, dirent.name),
      posInSet: index + 1,
      selected: false,
      setSize: newDirents.length,
      type: dirent.type,
    }))
    .toSorted(CompareDirent.compareDirent)

  const tree = createTree(items, root)
  const relativePath = path.slice(root.length)
  const updatedTree = {
    ...tree,
    [relativePath]: sortedDirents,
  }
  const newItems = treeToArray(updatedTree, root)
  return newItems
}

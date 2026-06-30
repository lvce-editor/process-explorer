import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import type { TreeItem } from '../TreeItem/TreeItem.ts'
import type { TreeUpdate } from '../TreeUpdate/TreeUpdate.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const getUpdatedChildren = (children: readonly ExplorerItem[], oldItems: readonly TreeItem[], newUri: string): readonly ExplorerItem[] => {
  const setSize = children.length
  return children.toSorted(CompareDirent.compareDirent).map((child, index) => {
    if (oldItems.length > 0 && child.path === newUri && child.type === DirentType.Directory) {
      return {
        ...child,
        posInSet: index + 1,
        setSize,
        type: DirentType.DirectoryExpanded,
      }
    }
    return {
      ...child,
      posInSet: index + 1,
      setSize,
    }
  })
}

export const computeExplorerRenamedDirentUpdate = (
  root: string,
  parentPath: string,
  oldUri: string,
  children: readonly ExplorerItem[],
  tree: Tree,
  newUri: string,
): TreeUpdate => {
  const rootLength = root.length
  const relativeDirname = parentPath.slice(rootLength)
  const relativeOldPath = oldUri.slice(rootLength)
  const relativeNewUri = newUri.slice(rootLength)
  const update: TreeUpdate = Object.create(null)
  const oldItems = tree[relativeOldPath] || []
  update[relativeDirname] = getUpdatedChildren(children, oldItems, newUri)
  update[relativeNewUri] = oldItems
  for (const [key, value] of Object.entries(tree)) {
    if (!key.startsWith(`${relativeOldPath}/`)) {
      continue
    }
    const newKey = relativeNewUri + key.slice(relativeOldPath.length)
    update[newKey] = value
  }
  return update
}

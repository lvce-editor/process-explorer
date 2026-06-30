import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getNewChildDirentsForNewDirent } from '../GetNewChildDirentsForNewDirent/GetNewChildDirentsForNewDirent.ts'

export const getNewDirentsForNewDirent = async (
  items: readonly ExplorerItem[],
  focusedIndex: number,
  type: number,
  root: string,
): Promise<readonly ExplorerItem[]> => {
  if (items.length === 0 || focusedIndex === -1) {
    const newDirent: ExplorerItem = {
      depth: 0,
      icon: '',
      name: '',
      path: root,
      posInSet: 1,
      selected: false,
      setSize: 1,
      type,
    }
    return [...items, newDirent]
  }

  const focusedItem = items[focusedIndex]
  if (!focusedItem) {
    return items
  }
  const parentPath = focusedItem.path
  const depth = focusedItem.depth + 1

  const updatedChildren = await getNewChildDirentsForNewDirent(items, depth, parentPath, type)

  // Create new array with updated items
  const parentIndex = focusedIndex
  const itemsBeforeParent = items.slice(0, parentIndex)
  const itemsAfterChildren = items.slice(parentIndex + updatedChildren.length)

  let updatedParent = {
    ...items[parentIndex],
    setSize: (items[parentIndex]?.setSize || 0) + 1,
  }

  // If the parent is a closed Directory, expand it
  if (updatedParent.type === DirentType.Directory) {
    updatedParent = { ...updatedParent, type: DirentType.DirectoryExpanded }
  }

  return [...itemsBeforeParent, updatedParent, ...updatedChildren, ...itemsAfterChildren]
}

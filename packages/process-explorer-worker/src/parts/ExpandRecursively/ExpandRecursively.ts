import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirentsRecursively from '../GetChildDirentsRecursively/GetChildDirentsRecursively.ts'
import * as GetParentEndIndex from '../GetParentEndIndex/GetParentEndIndex.ts'

export const expandRecursively = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items, pathSeparator, root } = state
  const dirent =
    focusedIndex < 0
      ? {
          depth: 0,
          path: root,
          type: DirentType.Directory,
        }
      : items[focusedIndex]
  if (dirent.type !== DirentType.Directory && dirent.type !== DirentType.DirectoryExpanding && dirent.type !== DirentType.DirectoryExpanded) {
    return state
  }
  // TODO race condition: what if folder is being collapse while it is recursively expanding?
  // TODO race condition: what if folder is being deleted while it is recursively expanding?
  // TODO race condition: what if a new file/folder is created while the folder is recursively expanding?
  // @ts-ignore
  const childDirents = await GetChildDirentsRecursively.getChildDirentsRecursively(dirent, pathSeparator)
  const startIndex = focusedIndex
  if (focusedIndex >= 0) {
    const endIndex = GetParentEndIndex.getParentEndIndex(items, focusedIndex)
    const newDirents = [...items.slice(0, startIndex), ...childDirents, ...items.slice(endIndex)]
    return {
      ...state,
      items: newDirents,
    }
  }
  const newDirents = childDirents.slice(1)
  return {
    ...state,
    items: newDirents,
  }
}

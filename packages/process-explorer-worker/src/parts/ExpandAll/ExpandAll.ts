import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'

export const expandAll = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, items, pathSeparator } = state
  if (focusedIndex === -1) {
    return state
  }
  const dirent = items[focusedIndex]
  const { depth } = dirent
  const newDirents = [...items]
  // TODO fetch child dirents in parallel
  for (const dirent of items) {
    if (dirent.depth !== depth || dirent.type !== DirentType.Directory) {
      continue
    }
    // TODO expand
    // TODO avoid mutating state here
    // @ts-ignore
    dirent.type = DirentType.DirectoryExpanding
    // TODO handle error
    // TODO race condition
    const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent.path, dirent.depth)
    const newIndex = newDirents.indexOf(dirent)
    if (newIndex === -1) {
      continue
    }
    newDirents.splice(newIndex + 1, 0, ...childDirents)
    // TODO avoid mutating state here
    // @ts-ignore
    dirent.type = DirentType.DirectoryExpanded
    // await expand(state, dirent.index)
  }
  return {
    ...state,
    items: newDirents,
  }
}

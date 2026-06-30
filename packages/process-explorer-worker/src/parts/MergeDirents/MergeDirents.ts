import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

const getMatchingOldIndex = (oldDirents: readonly ExplorerItem[], oldIndex: number, newDirent: ExplorerItem): number => {
  for (let i = oldIndex; i < oldDirents.length; i++) {
    if (oldDirents[i].path === newDirent.path) {
      return i
    }
  }
  return oldIndex
}

export const mergeDirents = (oldDirents: readonly ExplorerItem[], newDirents: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  const merged: ExplorerItem[] = []
  let oldIndex = 0
  for (const newDirent of newDirents) {
    merged.push(newDirent)
    // TOOD copy children of old dirent
    oldIndex = getMatchingOldIndex(oldDirents, oldIndex, newDirent)
  }
  return merged
}

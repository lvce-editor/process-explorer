import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

const getRelativePath = (root: string, pathSeparator: string, path: string): string => {
  if (root && path.startsWith(root)) {
    const relativePath = path.slice(root.length)
    if (relativePath.startsWith(pathSeparator)) {
      return relativePath.slice(pathSeparator.length)
    }
    return relativePath
  }
  if (path.startsWith(pathSeparator)) {
    return path.slice(pathSeparator.length)
  }
  return path
}

export const copyRelativePath = async (state: ExplorerState): Promise<ExplorerState> => {
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    return state
  }
  const relativePath = getRelativePath(state.root, state.pathSeparator, dirent.path)
  // TODO handle error
  await ClipBoard.writeText(relativePath)
  return state
}

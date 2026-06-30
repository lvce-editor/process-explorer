import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'
import { copyFilesElectron } from '../CopyFilesElectron/CopyFilesElectron.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import { getFileSystemHandle } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

const mergeDirents = (oldDirents: readonly ExplorerItem[], newDirents: readonly ExplorerItem[]): any => {
  return newDirents
}

const getMergedDirents = async (root: any, pathSeparator: any, dirents: any): Promise<any> => {
  const childDirents = await GetChildDirents.getChildDirents(pathSeparator, root, 0)
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

const openDroppedDirectoryAsWorkspace = async (state: ExplorerState, path: string): Promise<ExplorerState> => {
  await RendererWorker.invoke('Workspace.setPath', path)
  const updated = await LoadContent.loadContent(state, undefined)
  return {
    ...updated,
    dropTargets: [],
  }
}

const getFirstDroppedDirectoryPath = (state: ExplorerState, fileHandles: DroppedArgs, paths: readonly string[]): string | undefined => {
  if (state.root !== '') {
    return undefined
  }
  for (let i = 0; i < fileHandles.length; i++) {
    const fileHandle = getFileSystemHandle(fileHandles[i])
    if (isDirectoryHandle(fileHandle)) {
      return paths[i]
    }
  }
  return undefined
}

export const handleDrop = async (
  state: ExplorerState,
  fileHandles: DroppedArgs,
  files: readonly File[],
  paths: readonly string[],
): Promise<ExplorerState> => {
  const { items, pathSeparator, root } = state
  const droppedDirectoryPath = getFirstDroppedDirectoryPath(state, fileHandles, paths)
  if (droppedDirectoryPath) {
    return openDroppedDirectoryAsWorkspace(state, droppedDirectoryPath)
  }
  if (root === '') {
    return {
      ...state,
      dropTargets: [],
    }
  }
  await copyFilesElectron(root, fileHandles, files, paths)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    dropTargets: [],
    items: mergedDirents,
  }
}

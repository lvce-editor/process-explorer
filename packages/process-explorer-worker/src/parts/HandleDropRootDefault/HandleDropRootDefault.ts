import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import { isDirectoryHandle } from '../IsDirectoryHandle/IsDirectoryHandle.ts'
import * as LoadContent from '../LoadContent/LoadContent.ts'
import * as Refresh from '../Refresh/Refresh.ts'
import * as UploadFileSystemHandles from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

const mergeDirents = (oldDirents: readonly any[], newDirents: readonly any[]): readonly any[] => {
  return newDirents
}

const getMergedDirents = async (root: string, pathSeparator: string, dirents: readonly any[]): Promise<readonly any[]> => {
  const childDirents = await getChildDirents(pathSeparator, root, 0)
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

const getDroppedDirectoryWorkspacePath = (fileHandle: FileSystemDirectoryHandle): string => {
  return `html://${fileHandle.name}`
}

const openDroppedDirectoryAsWorkspace = async (state: ExplorerState, fileHandle: FileSystemDirectoryHandle): Promise<ExplorerState> => {
  const path = getDroppedDirectoryWorkspacePath(fileHandle)
  await RendererWorker.invoke('PersistentFileHandle.addHandle', fileHandle.name, fileHandle)
  await RendererWorker.invoke('Workspace.setPath', path)
  const updated = await LoadContent.loadContent(state, undefined)
  return {
    ...updated,
    dropTargets: [],
  }
}

const getFirstDroppedDirectory = (state: ExplorerState, fileHandles: DroppedArgs): FileSystemDirectoryHandle | undefined => {
  if (state.root !== '') {
    return undefined
  }
  for (const item of fileHandles) {
    const fileHandle = UploadFileSystemHandles.getFileSystemHandle(item)
    if (isDirectoryHandle(fileHandle)) {
      return fileHandle
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
  const droppedDirectory = getFirstDroppedDirectory(state, fileHandles)
  if (droppedDirectory) {
    return openDroppedDirectoryAsWorkspace(state, droppedDirectory)
  }
  if (root === '') {
    return {
      ...state,
      dropTargets: [],
    }
  }
  const handled = await UploadFileSystemHandles.uploadFileSystemHandles(root, pathSeparator, fileHandles)
  if (handled) {
    const updated = await Refresh.refresh(state)
    return {
      ...updated,
      dropTargets: [],
    }
  }
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    dropTargets: [],
    items: mergedDirents,
  }
}

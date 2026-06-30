import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { createUploadTree } from '../CreateUploadTree/CreateUploadTree.ts'
import * as GetFileOperations from '../GetFileOperations/GetFileOperations.ts'

export interface DroppedFileItem {
  readonly kind: 'file'
  readonly value: FileSystemFileHandle
}

export type DroppedItem = DroppedFileItem | FileSystemHandle
export type DroppedArgs = readonly DroppedFileItem[] | readonly FileSystemHandle[]

const isDroppedFile = (item: DroppedItem): item is DroppedFileItem => {
  return item.kind === 'file' && 'value' in item
}

export const getFileSystemHandle = (item: DroppedItem): FileSystemHandle => {
  if (isDroppedFile(item)) {
    return item.value
  }
  return item
}

export const getDroppedName = (item: DroppedItem): string => {
  if (isDroppedFile(item)) {
    return item.value.name
  }
  return item.name
}

const getFileSystemHandlesNormalized = (fileSystemHandles: DroppedArgs): readonly FileSystemHandle[] => {
  return Array.from(fileSystemHandles, getFileSystemHandle)
}

export const uploadFileSystemHandles = async (root: string, pathSeparator: string, fileSystemHandles: DroppedArgs): Promise<boolean> => {
  if (fileSystemHandles.length === 0) {
    return true
  }
  const fileSystemHandlesNormalized = getFileSystemHandlesNormalized(fileSystemHandles)
  const uploadTree = await createUploadTree(root, fileSystemHandlesNormalized)
  const fileOperations = GetFileOperations.getFileOperations(root, uploadTree)
  await ApplyFileOperations.applyFileOperations(fileOperations)

  // TODO
  // 1. in electron, use webutils.getPathForFile to see if a path is available
  // 2. else, walk all files and folders recursively and upload all of them (if there are many, show a progress bar)

  // TODO send file system operations to renderer worker
  return true
}

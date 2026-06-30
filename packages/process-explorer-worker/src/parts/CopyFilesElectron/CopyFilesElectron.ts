import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'
import { applyFileOperations } from '../ApplyFileOperations/ApplyFileOperations.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getFileOperationsElectron } from '../GetFileOperationsElectron/GetFileOperationsElectron.ts'

// TODO copy files in parallel
export const copyFilesElectron = async (root: string, fileHandles: DroppedArgs, files: readonly File[], paths: readonly string[]): Promise<void> => {
  const pathSeparator = await FileSystem.getPathSeparator(root)
  const operations = await getFileOperationsElectron(root, paths, fileHandles, pathSeparator)
  await applyFileOperations(operations)
}

import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as Path from '../Path/Path.ts'

export const getFileOperationsRename = (oldAbsolutePath: string, newFileName: string): readonly FileOperation[] => {
  const operations: FileOperation[] = []
  const oldParentPath = Path.dirname2(oldAbsolutePath)
  const newAbsolutePath = Path.join2(oldParentPath, newFileName)
  operations.push({
    from: oldAbsolutePath,
    path: newAbsolutePath,
    type: FileOperationType.Rename,
  })

  return operations
}

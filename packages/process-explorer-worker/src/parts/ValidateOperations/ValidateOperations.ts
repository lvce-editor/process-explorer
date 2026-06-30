import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import * as ValidateFolderCopy from '../ValidateFolderCopy/ValidateFolderCopy.ts'

export const validateOperations = (operations: readonly FileOperation[]): readonly string[] => {
  const errors: string[] = []
  for (const operation of operations) {
    if (operation.type !== FileOperationType.Copy) {
      continue
    }
    const errorMessage = ValidateFolderCopy.validateFolderCopy(operation.from, operation.path)
    if (errorMessage) {
      errors.push(errorMessage)
    }
  }
  return errors
}

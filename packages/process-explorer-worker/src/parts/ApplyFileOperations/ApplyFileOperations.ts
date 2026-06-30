import { VError } from '@lvce-editor/verror'
import type { FileOperation } from '../FileOperation/FileOperation.ts'
import { applyOperation as applyFileOperation } from '../ApplyFileOperation/ApplyFileOperation.ts'

export const applyFileOperations = async (operations: readonly FileOperation[]): Promise<string> => {
  try {
    // TODO run operations in parallel if possible
    for (const operation of operations) {
      await applyFileOperation(operation)
    }
    return ''
  } catch (error) {
    console.error(new VError(error, 'Failed to apply file operations'))
    return String(error)
  }
}

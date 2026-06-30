import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { FileOperation } from '../FileOperation/FileOperation.ts'
import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'
import * as AdjustScrollAfterPaste from '../AdjustScrollAfterPaste/AdjustScrollAfterPaste.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import * as FileOperationType from '../FileOperationType/FileOperationType.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getBaseName, join2 } from '../Path/Path.ts'
import { refresh } from '../Refresh/Refresh.ts'

const getOperations = (toUri: string, files: readonly string[]): readonly FileOperation[] => {
  const operations: FileOperation[] = []
  for (const file of files) {
    const baseName = getBaseName('/', file)
    const newUri = join2(toUri, baseName)
    operations.push({
      from: file,
      path: newUri,
      type: FileOperationType.Rename,
    })
  }
  return operations
}

const getTargetUri = (root: string, items: readonly ExplorerItem[], index: number): string => {
  if (index === -1) {
    return root
  }
  return items[index].path
}

export const handlePasteCut = async (state: ExplorerState, nativeFiles: NativeFilesResult): Promise<ExplorerState> => {
  const { focusedIndex, items, pathSeparator, root } = state
  // TODO root is not necessrily target uri
  const targetUri = getTargetUri(root, items, focusedIndex)
  const operations = getOperations(targetUri, nativeFiles.files)
  await ApplyFileOperations.applyFileOperations(operations)

  // Refresh the state after cut operations
  const latestState = await refresh(state)

  // Focus on the first pasted file and adjust scroll position
  if (nativeFiles.files.length > 0) {
    const firstPastedFile = nativeFiles.files[0]
    const targetPath = `${root}${pathSeparator}${getBaseName(pathSeparator, firstPastedFile)}`
    const pastedFileIndex = getIndex(latestState.items, targetPath)
    if (pastedFileIndex !== -1) {
      const adjustedState = AdjustScrollAfterPaste.adjustScrollAfterPaste(latestState, pastedFileIndex)
      return {
        ...adjustedState,
        cutItems: [],
        pasteShouldMove: false,
      }
    }
  }

  return {
    ...latestState,
    cutItems: [],
    pasteShouldMove: false,
  }
}

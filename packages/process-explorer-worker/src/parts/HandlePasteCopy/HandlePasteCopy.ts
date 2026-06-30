import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'
import * as AdjustScrollAfterPaste from '../AdjustScrollAfterPaste/AdjustScrollAfterPaste.ts'
import * as ApplyFileOperations from '../ApplyFileOperations/ApplyFileOperations.ts'
import { getFileOperationsCopy } from '../GetFileOperationsCopy/GetFileOperationsCopy.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { refresh } from '../Refresh/Refresh.ts'

export const handlePasteCopy = async (state: ExplorerState, nativeFiles: NativeFilesResult): Promise<ExplorerState> => {
  // TODO handle pasting files into nested folder
  // TODO handle pasting files into symlink
  // TODO handle pasting files into broken symlink
  // TODO handle pasting files into hardlink
  // TODO what if folder is big and it takes a long time

  // TODO use file operations and bulk edit
  const { focusedIndex, items, root } = state
  const focusedUri = items[focusedIndex]?.path || root
  const existingUris = items.map((item) => item.path)
  const operations = getFileOperationsCopy(root, existingUris, nativeFiles.files, focusedUri)
  // TODO handle error?
  await ApplyFileOperations.applyFileOperations(operations)

  // TODO use refreshExplorer with the paths that have been affected by file operations
  // TODO only update folder at which level it changed
  const latestState = await refresh(state)

  // Focus on the first newly created file and adjust scroll position
  const newFilePaths = operations.map((operation) => operation.path)
  if (newFilePaths.length > 0) {
    const firstNewFilePath = newFilePaths[0]
    const newFileIndex = getIndex(latestState.items, firstNewFilePath)
    if (newFileIndex !== -1) {
      const adjustedState = AdjustScrollAfterPaste.adjustScrollAfterPaste(latestState, newFileIndex)
      return {
        ...adjustedState,
        pasteShouldMove: false,
      }
    }
  }
  // If there are no items, ensure focusedIndex is 0
  if (latestState.items.length === 0) {
    return {
      ...latestState,
      focusedIndex: 0,
      pasteShouldMove: false,
    }
  }
  return {
    ...latestState,
    pasteShouldMove: false,
  }
}

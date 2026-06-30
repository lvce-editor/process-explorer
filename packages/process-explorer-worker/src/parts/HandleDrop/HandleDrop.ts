import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import * as GetFileArray from '../GetFileArray/GetFileArray.ts'
import { getFileHandles } from '../GetFileHandles/GetFileHandles.ts'
import { getFilePaths } from '../GetFilePaths/GetFilePaths.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (
  state: ExplorerState,
  x: number,
  y: number,
  fileIds: readonly number[],
  fileList: FileList,
): Promise<ExplorerState> => {
  try {
    const { platform } = state
    const files = GetFileArray.getFileArray(fileList)
    const fileHandles = await getFileHandles(fileIds)
    const paths = await getFilePaths(files, platform)
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    const fn = getDropHandler(index)
    const result = await fn(state, fileHandles, files, paths, index)
    return result
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}

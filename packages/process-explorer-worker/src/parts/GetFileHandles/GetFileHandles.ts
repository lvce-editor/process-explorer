import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

export const getFileHandles = async (fileIds: readonly number[]): Promise<DroppedArgs> => {
  if (fileIds.length === 0) {
    return []
  }
  const files = await RendererWorker.getFileHandles(fileIds)
  return files
}

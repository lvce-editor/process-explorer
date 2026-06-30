import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

export interface DropHandler {
  (state: ExplorerState, fileHandles: DroppedArgs, files: readonly File[], paths: readonly string[], index: number): Promise<ExplorerState>
}

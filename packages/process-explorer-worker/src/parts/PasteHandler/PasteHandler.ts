import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'

export interface PasteHandler {
  (state: ExplorerState, nativeFiles: NativeFilesResult): Promise<ExplorerState>
}

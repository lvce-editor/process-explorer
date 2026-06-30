import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export interface ContextMenuHandler {
  (state: ExplorerState, x: number, y: number): Promise<ExplorerState>
}

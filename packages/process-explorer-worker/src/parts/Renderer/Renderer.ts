import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export interface Renderer {
  (oldState: ExplorerState, newState: ExplorerState): readonly any[]
}

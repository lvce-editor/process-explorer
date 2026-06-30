import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export interface Renderer {
  (
    oldState: ProcessExplorerState,
    newState: ProcessExplorerState,
  ): readonly any[]
}

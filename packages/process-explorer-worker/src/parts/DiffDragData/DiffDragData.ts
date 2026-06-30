import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.isPointerDown || !newState.isPointerDown
}

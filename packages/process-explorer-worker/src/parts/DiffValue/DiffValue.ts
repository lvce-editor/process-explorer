import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const isEqual = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  if (newState.focus !== FocusId.Input) {
    return true
  }
  return oldState.focus === FocusId.Input && newState.focus === FocusId.Input && oldState.editingValue === newState.editingValue
}

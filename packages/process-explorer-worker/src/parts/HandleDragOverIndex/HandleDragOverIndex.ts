import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetNewDropTargets from '../GetNewDropTargets/GetNewDropTargets.ts'
import * as IsEqual from '../IsEqual/IsEqual.ts'

export const handleDragOverIndex = (state: ExplorerState, index: number): ExplorerState => {
  const { dropTargets } = state
  const newDropTargets = GetNewDropTargets.getNewDropTargets(state, index)
  if (IsEqual.isEqual(dropTargets, newDropTargets)) {
    return state
  }
  return {
    ...state,
    dropTargets: newDropTargets,
  }
}

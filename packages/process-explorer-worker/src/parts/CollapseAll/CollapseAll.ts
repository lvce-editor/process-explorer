import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as IsTopLevel from '../IsTopLevel/IsTopLevel.ts'
import * as ToCollapsedDirent from '../ToCollapsedDirent/ToCollapsedDirent.ts'

export const collapseAll = async (state: ExplorerState): Promise<ExplorerState> => {
  const { items } = state
  const newDirents = items.filter(IsTopLevel.isTopLevel).map(ToCollapsedDirent.toCollapsedDirent)
  return {
    ...state,
    focusedIndex: 0,
    items: newDirents,
  }
}

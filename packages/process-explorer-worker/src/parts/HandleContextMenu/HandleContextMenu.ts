import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const handleContextMenu = async (
  state: ProcessExplorerState,
  index: number = state.focusedIndex,
  x: number = 0,
  y: number = 0,
): Promise<ProcessExplorerState> => {
  const process = state.visibleProcesses[index]
  if (!process) {
    return state
  }
  const newState: ProcessExplorerState = {
    ...state,
    focused: false,
    focusedIndex: index,
  }
  ProcessExplorerStates.set(state.uid, state, newState)
  await ContextMenu.show2(state.uid, MenuEntryId.ProcessExplorer, x, y, {
    index,
    menuId: MenuEntryId.ProcessExplorer,
  })
  return newState
}

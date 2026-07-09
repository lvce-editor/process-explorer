import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const handleContextMenu = async (
  state: ProcessExplorerState,
  index: number | string = state.focusedIndex,
  x: number = 0,
  y: number = 0,
): Promise<ProcessExplorerState> => {
  const numericIndex = Number(index)
  const process = state.visibleProcesses[numericIndex]
  if (!process) {
    return state
  }
  const newState: ProcessExplorerState = {
    ...state,
    focused: false,
    focusedIndex: numericIndex,
  }
  ProcessExplorerStates.set(state.uid, state, newState)
  await ContextMenu.show2(state.uid, MenuEntryId.ProcessExplorer, x, y, {
    index: numericIndex,
    menuId: MenuEntryId.ProcessExplorer,
  })
  return newState
}

import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.ts'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const handleContextMenu = async (
  state: ProcessExplorerState,
  index: number | string | undefined = undefined,
  x: number = 0,
  y: number = 0,
): Promise<ProcessExplorerState> => {
  const { focusedIndex, uid, visibleProcesses } = state
  const numericIndex = Number(index === undefined ? focusedIndex : index)
  const process = visibleProcesses[numericIndex]
  if (!process) {
    return state
  }
  const newState: ProcessExplorerState = {
    ...state,
    focused: false,
    focusedIndex: numericIndex,
  }
  ProcessExplorerStates.set(uid, state, newState)
  await ContextMenu.show2(uid, MenuEntryId.ProcessExplorer, x, y, {
    index: numericIndex,
    menuId: MenuEntryId.ProcessExplorer,
  })
  return newState
}

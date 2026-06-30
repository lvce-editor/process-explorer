import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleClick from '../HandleClick/HandleClick.ts'

export const handleClickCurrent = (state: ExplorerState): Promise<ExplorerState> => {
  return HandleClick.handleClick(state, state.focusedIndex - state.minLineY, /* keepFocus */ false)
}

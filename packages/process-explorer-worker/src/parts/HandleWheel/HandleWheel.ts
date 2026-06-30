import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const handleWheel = (state: ExplorerState, deltaMode: number, deltaY: number): Promise<ExplorerState> => {
  return SetDeltaY.setDeltaY(state, state.deltaY + deltaY)
}

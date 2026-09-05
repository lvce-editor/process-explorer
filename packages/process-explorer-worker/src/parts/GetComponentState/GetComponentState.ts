import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const getComponentState = (uid: number): ProcessExplorerState => {
  return ProcessExplorerStates.get(uid).newState
}

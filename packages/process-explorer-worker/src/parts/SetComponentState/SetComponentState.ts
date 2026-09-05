import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

const applyComponentState = (
  currentState: ProcessExplorerState,
  state: ProcessExplorerState,
): ProcessExplorerState => {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('Process Explorer state must be an object')
  }
  const { uid } = state
  const { uid: currentUid } = currentState
  if (uid !== currentUid) {
    throw new Error(`Process Explorer state uid must remain ${currentUid}`)
  }
  return state
}

export const setComponentState =
  ProcessExplorerStates.wrapCommand(applyComponentState)

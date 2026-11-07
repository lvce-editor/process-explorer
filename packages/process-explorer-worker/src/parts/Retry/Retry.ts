import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as AutoRefresh from '../AutoRefresh/AutoRefresh.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as InitializeProcessExplorer from '../InitializeProcessExplorer/InitializeProcessExplorer.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import * as Refresh from '../Refresh/Refresh.ts'

// DEBUG-retry-6aef: temporary Windows CI probe.
let debugStage = 'not called'
export const getDebugStage = (): string => debugStage

const pending = new Map<number, Promise<ProcessExplorerState>>()

const reconnect = async (
  state: ProcessExplorerState,
): Promise<ProcessExplorerState> => {
  const { errorCode, uid } = state
  debugStage = 'retiring endpoint'
  AutoRefresh.dispose(uid)
  if (errorCode === ErrorCodes.ProcessExplorerRpcConnectionClosed) {
    await InitializeProcessExplorer.retireClosedConnection()
  }
  debugStage = 'refreshing'
  const newState = await Refresh.refresh({ ...state, rootPid: -1 })
  debugStage = `completed: ${newState.errorCode} ${newState.errorMessage}`
  if (
    ProcessExplorerStates.get(uid) &&
    !newState.errorMessage &&
    !newState.errorCode &&
    !newState.message
  ) {
    AutoRefresh.start(uid, newState.updateInterval)
  }
  return newState
}

export const retry = async (
  state: ProcessExplorerState,
): Promise<ProcessExplorerState> => {
  const { uid } = state
  const existing = pending.get(uid)
  if (existing) {
    return existing
  }
  const promise = reconnect(state)
  pending.set(uid, promise)
  try {
    return await promise
  } finally {
    pending.delete(uid)
  }
}

export const waitForPending = async (uid: number): Promise<void> => {
  await pending.get(uid)
}

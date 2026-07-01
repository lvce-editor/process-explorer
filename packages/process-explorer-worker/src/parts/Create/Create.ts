import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

export const create = (
  id: number,
  _uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  _args: unknown,
  parentUid: number,
  platform: number = 0,
  assetDir: string = '',
): ProcessExplorerState => {
  const state: ProcessExplorerState = {
    assetDir,
    collapsedPids: [],
    errorCodeFrame: '',
    errorMessage: '',
    errorStack: '',
    focus: 0,
    focused: false,
    focusedIndex: -1,
    height,
    initial: true,
    parentUid,
    platform,
    processes: [],
    rootPid: 0,
    uid: id,
    visibleProcesses: [],
    width,
    x,
    y,
  }
  ProcessExplorerStates.set(state.uid, state, state)
  return state
}

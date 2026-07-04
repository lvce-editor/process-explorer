import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'

interface CreateArgs {
  readonly includeFrontendMemoryUsage?: boolean
}

const getIncludeFrontendMemoryUsage = (args: unknown): boolean => {
  if (!args || typeof args !== 'object') {
    return false
  }
  const createArgs = args as CreateArgs
  return createArgs.includeFrontendMemoryUsage === true
}

export const create = (
  id: number,
  _uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  args: unknown,
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
    includeFrontendMemoryUsage: getIncludeFrontendMemoryUsage(args),
    initial: true,
    parentUid,
    platform,
    processes: [],
    rootPid: -1,
    uid: id,
    visibleProcesses: [],
    width,
    x,
    y,
  }
  ProcessExplorerStates.set(state.uid, state, state)
  return state
}

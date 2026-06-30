import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'

export const createDefaultState = (): ProcessExplorerState => ({
  assetDir: '',
  collapsedPids: [],
  errorCodeFrame: '',
  errorMessage: '',
  errorStack: '',
  focus: 0,
  focused: true,
  focusedIndex: -1,
  height: 100,
  initial: false,
  parentUid: 0,
  processes: [],
  rootPid: 0,
  uid: 1,
  visibleProcesses: [],
  width: 100,
  x: 0,
  y: 0,
})

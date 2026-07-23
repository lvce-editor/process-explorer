import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as ProcessExplorerUpdateInterval from '../ProcessExplorerUpdateInterval/ProcessExplorerUpdateInterval.ts'

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
  includeFrontendMemoryUsage: false,
  initial: false,
  parentUid: 0,
  platform: 0,
  processes: [],
  rootPid: -1,
  uid: 1,
  updateInterval: ProcessExplorerUpdateInterval.processExplorerUpdateInterval,
  visibleProcesses: [],
  width: 100,
  x: 0,
  y: 0,
})

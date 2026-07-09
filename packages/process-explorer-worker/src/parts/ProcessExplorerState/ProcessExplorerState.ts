import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'

export interface ProcessExplorerState {
  readonly assetDir: string
  readonly collapsedPids: readonly number[]
  readonly errorCodeFrame: string
  readonly errorMessage: string
  readonly errorStack: string
  readonly focus: number
  readonly focused: boolean
  readonly focusedIndex: number
  readonly height: number
  readonly includeFrontendMemoryUsage: boolean
  readonly initial: boolean
  readonly parentUid: number
  readonly platform: number
  readonly processes: readonly ProcessInfo[]
  readonly rootPid: number
  readonly uid: number
  readonly updateInterval: number
  readonly visibleProcesses: readonly VisibleProcess[]
  readonly width: number
  readonly x: number
  readonly y: number
}

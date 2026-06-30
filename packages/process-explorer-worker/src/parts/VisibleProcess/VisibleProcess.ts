import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

export interface VisibleProcess extends ProcessInfo {
  readonly depth: number
  readonly flags: number
}

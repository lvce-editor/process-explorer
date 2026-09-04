import type { LinuxProcessStat } from '../LinuxProcessStat/LinuxProcessStat.ts'

export interface LinuxProcessStatWithDepth extends LinuxProcessStat {
  readonly depth: number
}

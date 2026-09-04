import type { LinuxProcessStat } from '../LinuxProcessStat/LinuxProcessStat.ts'

export type ProcessStatByPid = Record<number, LinuxProcessStat | undefined>
export type ProcessStatsByParentPid = Record<
  number,
  LinuxProcessStat[] | undefined
>

export interface LinuxProcessIndexes {
  readonly childrenByParentPid: ProcessStatsByParentPid
  readonly statsByPid: ProcessStatByPid
}

export const createLinuxProcessIndexes = (
  stats: readonly LinuxProcessStat[],
): LinuxProcessIndexes => {
  const statsByPid: ProcessStatByPid = Object.create(null)
  const childrenByParentPid: ProcessStatsByParentPid = Object.create(null)
  for (const stat of stats) {
    statsByPid[stat.pid] = stat
    const children = childrenByParentPid[stat.ppid]
    if (children) {
      children.push(stat)
    } else {
      childrenByParentPid[stat.ppid] = [stat]
    }
  }
  return {
    childrenByParentPid,
    statsByPid,
  }
}

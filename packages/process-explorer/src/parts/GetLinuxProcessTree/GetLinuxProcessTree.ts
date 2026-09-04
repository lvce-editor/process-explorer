import type { LinuxProcessStat } from '../LinuxProcessStat/LinuxProcessStat.ts'
import type { LinuxProcessStatWithDepth } from '../LinuxProcessStatWithDepth/LinuxProcessStatWithDepth.ts'
import * as CreateLinuxProcessIndexes from '../CreateLinuxProcessIndexes/CreateLinuxProcessIndexes.ts'
import * as GetInitialLinuxProcesses from '../GetInitialLinuxProcesses/GetInitialLinuxProcesses.ts'

export const getLinuxProcessTree = (
  stats: readonly LinuxProcessStat[],
  rootPid: number,
): readonly LinuxProcessStatWithDepth[] => {
  const { childrenByParentPid, statsByPid } =
    CreateLinuxProcessIndexes.createLinuxProcessIndexes(stats)
  const pending = GetInitialLinuxProcesses.getInitialLinuxProcesses(
    statsByPid,
    childrenByParentPid,
    rootPid,
  )
  const result: LinuxProcessStatWithDepth[] = []
  while (pending.length > 0) {
    const current = pending.pop()
    if (!current) {
      continue
    }
    result.push(current)
    const children = childrenByParentPid[current.pid]
    if (!children) {
      continue
    }
    for (const child of children) {
      pending.push({
        ...child,
        depth: current.depth + 1,
      })
    }
  }
  return result.toSorted((a, b) => a.pid - b.pid)
}

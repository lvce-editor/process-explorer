import type {
  ProcessStatByPid,
  ProcessStatsByParentPid,
} from '../CreateLinuxProcessIndexes/CreateLinuxProcessIndexes.ts'
import type { LinuxProcessStatWithDepth } from '../LinuxProcessStatWithDepth/LinuxProcessStatWithDepth.ts'

export const getInitialLinuxProcesses = (
  statsByPid: ProcessStatByPid,
  childrenByParentPid: ProcessStatsByParentPid,
  rootPid: number,
): LinuxProcessStatWithDepth[] => {
  const root = statsByPid[rootPid]
  if (root) {
    return [{ ...root, depth: 1 }]
  }
  const rootChildren = childrenByParentPid[rootPid]
  if (!rootChildren) {
    return []
  }
  return rootChildren.map((stat) => ({
    ...stat,
    depth: 1,
  }))
}

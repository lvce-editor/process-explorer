import type { PidMap } from '../PidMap/PidMap.ts'
import type { ProcessItemWithDepth } from '../ProcessItem/ProcessItem.ts'
import * as GetLinuxProcessStats from '../GetLinuxProcessStats/GetLinuxProcessStats.ts'
import * as GetLinuxProcessTree from '../GetLinuxProcessTree/GetLinuxProcessTree.ts'
import * as ToLinuxProcessItem from '../ToLinuxProcessItem/ToLinuxProcessItem.ts'

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
  pidMap: PidMap,
): Promise<readonly ProcessItemWithDepth[]> => {
  const stats = GetLinuxProcessStats.getLinuxProcessStats()
  const processTree = GetLinuxProcessTree.getLinuxProcessTree(stats, rootPid)
  const result: ProcessItemWithDepth[] = []
  for (const process of processTree) {
    const processItem = ToLinuxProcessItem.toLinuxProcessItem(
      process,
      rootPid,
      pidMap,
    )
    if (processItem) {
      result.push(processItem)
    }
  }
  return result
}

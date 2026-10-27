import type { MemoryBreakdownEntry } from '../MemoryBreakdownEntry/MemoryBreakdownEntry.ts'
import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as GetBreakdownName from '../GetBreakdownName/GetBreakdownName.ts'
import * as WindowPid from '../WindowPid/WindowPid.ts'

export const toBreakdownProcess = (
  entry: MemoryBreakdownEntry,
  index: number,
): ProcessInfo => {
  const name = GetBreakdownName.getBreakdownName(entry, index)
  return {
    cmd: name,
    memory: entry.bytes,
    name,
    parentTreeId: WindowPid.WindowPid,
    pid: -2 - index,
    ppid: WindowPid.WindowPid,
    source: 'local',
    synthetic: true,
    treeId: -2 - index,
  }
}

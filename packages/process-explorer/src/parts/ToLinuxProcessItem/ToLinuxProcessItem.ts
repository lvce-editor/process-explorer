import type { LinuxProcessStatWithDepth } from '../LinuxProcessStatWithDepth/LinuxProcessStatWithDepth.ts'
import type { PidMap } from '../PidMap/PidMap.ts'
import type { ProcessItemWithDepth } from '../ProcessItem/ProcessItem.ts'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.ts'
import * as ReadLinuxProcessCommandLine from '../ReadLinuxProcessCommandLine/ReadLinuxProcessCommandLine.ts'
import * as ReadLinuxProcessPss from '../ReadLinuxProcessPss/ReadLinuxProcessPss.ts'

export const toLinuxProcessItem = (
  process: LinuxProcessStatWithDepth,
  rootPid: number,
  pidMap: PidMap,
): ProcessItemWithDepth | undefined => {
  const cmd = ReadLinuxProcessCommandLine.readLinuxProcessCommandLine(process)
  if (cmd === undefined) {
    return undefined
  }
  const pss = ReadLinuxProcessPss.readLinuxProcessPss(process.pid)
  const { memory: rss } = process
  let memory = rss
  if (pss !== undefined) {
    memory = pss
  }
  return {
    cmd,
    depth: process.depth,
    memory,
    name: ListProcessGetName.getName(process.pid, cmd, rootPid, pidMap),
    pid: process.pid,
    ppid: process.ppid,
  }
}

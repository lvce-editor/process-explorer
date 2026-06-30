import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'

const getRootProcess = (
  processes: readonly ProcessInfo[],
  rootPid: number,
): ProcessInfo | undefined => {
  if (rootPid) {
    return processes.find((process) => process.pid === rootPid)
  }
  return processes[0]
}

const hasChildren = (
  processes: readonly ProcessInfo[],
  pid: number,
): boolean => {
  return processes.some((process) => process.ppid === pid)
}

const getChildren = (
  processes: readonly ProcessInfo[],
  collapsedPids: readonly number[],
  process: ProcessInfo,
  depth: number,
): readonly VisibleProcess[] => {
  const children = processes.filter(
    (otherProcess) => otherProcess.ppid === process.pid,
  )
  if (children.length === 0) {
    return []
  }
  if (collapsedPids.includes(process.pid)) {
    return []
  }
  return children.flatMap((child) =>
    withChildren(processes, collapsedPids, child, depth + 1),
  )
}

const withChildren = (
  processes: readonly ProcessInfo[],
  collapsedPids: readonly number[],
  process: ProcessInfo,
  depth: number,
): readonly VisibleProcess[] => {
  const processHasChildren = hasChildren(processes, process.pid)
  let flags = ProcessFlag.None
  if (processHasChildren && collapsedPids.includes(process.pid)) {
    flags = ProcessFlag.Collapsed
  } else if (processHasChildren) {
    flags = ProcessFlag.Expanded
  }
  const visibleProcess: VisibleProcess = {
    ...process,
    depth,
    flags,
  }
  return [
    visibleProcess,
    ...getChildren(processes, collapsedPids, process, depth),
  ]
}

export const getVisibleProcesses = (
  processes: readonly ProcessInfo[],
  collapsedPids: readonly number[],
  rootPid: number,
): readonly VisibleProcess[] => {
  const rootProcess = getRootProcess(processes, rootPid)
  if (!rootProcess) {
    return []
  }
  return withChildren(processes, collapsedPids, rootProcess, 1)
}

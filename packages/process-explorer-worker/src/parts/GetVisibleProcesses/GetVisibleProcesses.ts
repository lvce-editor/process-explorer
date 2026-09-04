import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import * as ProcessFlag from '../ProcessFlag/ProcessFlag.ts'

const getTreeId = (process: ProcessInfo): number | string => {
  return process.treeId ?? process.pid
}

const getParentTreeId = (process: ProcessInfo): number | string => {
  return process.parentTreeId ?? process.ppid
}

const getRootProcesses = (
  processes: readonly ProcessInfo[],
  rootPid: number,
): readonly ProcessInfo[] => {
  const groupedProcesses = processes.filter(
    (process) => process.parentTreeId === '',
  )
  if (groupedProcesses.length > 0) {
    return groupedProcesses
  }
  if (rootPid) {
    const rootProcess = processes.find((process) => process.pid === rootPid)
    return rootProcess ? [rootProcess] : []
  }
  return processes.length > 0 ? [processes[0]] : []
}

const hasChildren = (
  processes: readonly ProcessInfo[],
  pid: number | string,
): boolean => {
  return processes.some((process) => getParentTreeId(process) === pid)
}

const getChildren = (
  processes: readonly ProcessInfo[],
  collapsedPids: readonly (number | string)[],
  process: ProcessInfo,
  depth: number,
): readonly VisibleProcess[] => {
  const children = processes.filter(
    (otherProcess) => getParentTreeId(otherProcess) === getTreeId(process),
  )
  if (children.length === 0) {
    return []
  }
  if (collapsedPids.includes(getTreeId(process))) {
    return []
  }
  return children.flatMap((child) =>
    withChildren(processes, collapsedPids, child, depth + 1),
  )
}

const withChildren = (
  processes: readonly ProcessInfo[],
  collapsedPids: readonly (number | string)[],
  process: ProcessInfo,
  depth: number,
): readonly VisibleProcess[] => {
  const treeId = getTreeId(process)
  const processHasChildren = hasChildren(processes, treeId)
  let flags = ProcessFlag.None
  if (processHasChildren && collapsedPids.includes(treeId)) {
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
  collapsedPids: readonly (number | string)[],
  rootPid: number,
): readonly VisibleProcess[] => {
  const rootProcesses = getRootProcesses(processes, rootPid)
  return rootProcesses.flatMap((rootProcess) =>
    withChildren(processes, collapsedPids, rootProcess, 1),
  )
}

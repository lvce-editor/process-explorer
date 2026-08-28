import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

const createGroup = (
  name: string,
  source: 'local' | 'remote',
  processes: readonly ProcessInfo[],
  rootPid: number,
): readonly ProcessInfo[] => {
  const groupId = `${source}:group`
  const group: ProcessInfo = {
    cmd: name,
    memory: 0,
    name,
    parentTreeId: '',
    pid: 0,
    ppid: 0,
    source,
    synthetic: true,
    treeId: groupId,
  }
  const groupedProcesses = processes.map((process) => ({
    ...process,
    parentTreeId:
      process.pid === rootPid ? groupId : `${source}:${process.ppid}`,
    source,
    treeId: `${source}:${process.pid}`,
  }))
  return [group, ...groupedProcesses]
}

export const groupProcesses = (
  localProcesses: readonly ProcessInfo[],
  localRootPid: number,
  remoteProcesses: readonly ProcessInfo[],
  remoteRootPid: number,
): readonly ProcessInfo[] => {
  return [
    ...createGroup('Local', 'local', localProcesses, localRootPid),
    ...createGroup('Remote', 'remote', remoteProcesses, remoteRootPid),
  ]
}

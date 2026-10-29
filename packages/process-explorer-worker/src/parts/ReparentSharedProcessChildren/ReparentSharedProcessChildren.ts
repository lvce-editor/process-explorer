import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

const conceptualChildNames: readonly string[] = [
  'embeds-process',
  'extension-builtin.remote-ssh:remote-SSH',
  'file-system-process',
  'file-watcher-process',
  'process-explorer',
  'remote-ssh',
  'search-process',
  'terminal-process',
]

export const reparentSharedProcessChildren = (
  processes: readonly ProcessInfo[],
): readonly ProcessInfo[] => {
  const sharedProcess = processes.find(
    (process) => process.name === 'shared-process',
  )
  if (!sharedProcess) {
    return processes
  }
  return processes.map((process) => {
    if (
      process.ppid === sharedProcess.pid ||
      !conceptualChildNames.includes(process.name)
    ) {
      return process
    }
    return {
      ...process,
      parentTreeId: sharedProcess.treeId,
      ppid: sharedProcess.pid,
    }
  })
}

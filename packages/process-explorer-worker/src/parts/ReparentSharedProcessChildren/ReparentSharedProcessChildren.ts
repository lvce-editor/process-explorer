import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

const conceptualChildNames: readonly string[] = [
  'embeds-process',
  'file-system-process',
  'file-watcher-process',
  'process-explorer',
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
      ppid: sharedProcess.pid,
    }
  })
}

import type { IProcessInfo } from '@vscode/windows-process-tree'
import * as LoadWindowsProcessTree from '../LoadWindowsProcessTree/LoadWindowsProcessTree.ts'
import * as Promises from '../Promises/Promises.ts'

export const getProcessList = async (
  rootPid: number,
  flags: number,
): Promise<IProcessInfo[] | undefined> => {
  const WindowsProcessTree =
    await LoadWindowsProcessTree.loadWindowProcessTree()
  const { resolve, promise } = Promises.withResolvers<
    IProcessInfo[] | undefined
  >()
  WindowsProcessTree.getProcessList(rootPid, resolve, flags)
  return promise
}

/**
 *
 * @param {any[]} processList
 * @returns Promise< WindowsProcessTree.IProcessCpuInfo[]>
 */
export const addCpuUsage = async (processList) => {
  const WindowsProcessTree =
    await LoadWindowsProcessTree.loadWindowProcessTree()
  const { resolve, promise } = Promises.withResolvers()
  WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  return promise
}

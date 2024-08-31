import type {
  IProcessCpuInfo,
  IProcessInfo,
} from '@vscode/windows-process-tree'
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

export const addCpuUsage = async (processList: IProcessCpuInfo[]) => {
  const WindowsProcessTree =
    await LoadWindowsProcessTree.loadWindowProcessTree()
  const { resolve, promise } = Promises.withResolvers<IProcessCpuInfo[]>()
  WindowsProcessTree.getProcessCpuUsage(processList, resolve)
  return promise
}

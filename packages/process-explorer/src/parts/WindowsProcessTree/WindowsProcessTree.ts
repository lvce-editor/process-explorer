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
  const { promise, resolve } = Promises.withResolvers<
    IProcessInfo[] | undefined
  >()
  WindowsProcessTree.getProcessList(rootPid, resolve, flags)
  return promise
}

export const addCpuUsage = async (
  processList: ReadonlyArray<Readonly<IProcessCpuInfo>>,
): Promise<IProcessCpuInfo[]> => {
  const WindowsProcessTree =
    await LoadWindowsProcessTree.loadWindowProcessTree()
  const { promise, resolve } = Promises.withResolvers<IProcessCpuInfo[]>()
  const mutableProcessList = processList.map((process) => ({ ...process }))
  WindowsProcessTree.getProcessCpuUsage(mutableProcessList, resolve)
  return promise
}

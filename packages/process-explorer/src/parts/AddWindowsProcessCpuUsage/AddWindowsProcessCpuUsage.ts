import type { IProcessCpuInfo } from '@vscode/windows-process-tree'
import * as LoadWindowsProcessTree from '../LoadWindowsProcessTree/LoadWindowsProcessTree.ts'
import * as Promises from '../Promises/Promises.ts'

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

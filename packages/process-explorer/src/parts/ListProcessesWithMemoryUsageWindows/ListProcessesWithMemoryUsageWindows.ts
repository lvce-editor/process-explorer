// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import type { CompleteProcessInfo } from '../CompleteProcessInfo/CompleteProcessInfo.ts'
import type { ProcessItem } from '../ProcessItem/ProcessItem.ts'
import * as AddWindowsProcessCpuUsage from '../AddWindowsProcessCpuUsage/AddWindowsProcessCpuUsage.ts'
import * as CreatePidMap from '../CreatePidMap/CreatePidMap.ts'
import * as GetWindowsProcessList from '../GetWindowsProcessList/GetWindowsProcessList.ts'
import * as ToResult from '../ToResult/ToResult.ts'
import { VError } from '../VError/VError.ts'
import * as WindowsProcessTreeDataFlag from '../WindowsProcessTreeDataFlag/WindowsProcessTreeDataFlag.ts'

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
): Promise<readonly ProcessItem[]> => {
  try {
    const processList = await GetWindowsProcessList.getProcessList(
      rootPid,
      WindowsProcessTreeDataFlag.CommandLine |
        WindowsProcessTreeDataFlag.Memory,
    )
    if (!processList) {
      throw new VError(`Root process ${rootPid} not found`)
    }
    const pidMap = await CreatePidMap.createPidMap()
    const completeProcessList =
      await AddWindowsProcessCpuUsage.addCpuUsage(processList)
    const result = ToResult.toResult(
      completeProcessList as ReadonlyArray<Readonly<CompleteProcessInfo>>,
      rootPid,
      pidMap,
    )
    return result
  } catch (error) {
    // @ts-ignore
    throw new VError(error, `Failed to list processes`)
  }
}

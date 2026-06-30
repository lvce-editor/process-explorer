// listProcesses windows implementation based on https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import type { IProcessCpuInfo } from '@vscode/windows-process-tree'
import type { ProcessItem } from '../ProcessItem/ProcessItem.ts'
import * as CreatePidMap from '../CreatePidMap/CreatePidMap.ts'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.ts'
import { VError } from '../VError/VError.ts'
import * as WindowsProcessTree from '../WindowsProcessTree/WindowsProcessTree.ts'
import * as WindowsProcessTreeDataFlag from '../WindowsProcessTreeDataFlag/WindowsProcessTreeDataFlag.ts'

type CompleteProcessInfo = Readonly<IProcessCpuInfo> & {
  readonly commandLine: string
  readonly memory: number
}

/**
 * @param {import('@vscode/windows-process-tree').IProcessCpuInfo} item
 * @param {number} rootPid
 * @param {object} pidMap
 */
const toResultItem = (
  item: Readonly<CompleteProcessInfo>,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): ProcessItem => {
  return {
    cmd: item.commandLine,
    memory: item.memory,
    name: ListProcessGetName.getName(
      item.pid,
      item.commandLine,
      rootPid,
      pidMap,
    ),
    pid: item.pid,
    ppid: item.ppid,
  }
}

const toResult = (
  completeProcessList: ReadonlyArray<Readonly<CompleteProcessInfo>>,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): readonly ProcessItem[] => {
  const results = Array.from(completeProcessList, (item) =>
    toResultItem(item, rootPid, pidMap),
  )
  return results
}

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
): Promise<readonly ProcessItem[]> => {
  try {
    const processList = await WindowsProcessTree.getProcessList(
      rootPid,
      WindowsProcessTreeDataFlag.CommandLine |
        WindowsProcessTreeDataFlag.Memory,
    )
    if (!processList) {
      throw new VError(`Root process ${rootPid} not found`)
    }
    const pidMap = await CreatePidMap.createPidMap()
    const completeProcessList =
      await WindowsProcessTree.addCpuUsage(processList)
    const result = toResult(
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

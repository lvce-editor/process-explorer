import type { CompleteProcessInfo } from '../CompleteProcessInfo/CompleteProcessInfo.ts'
import type { ProcessItem } from '../ProcessItem/ProcessItem.ts'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.ts'

export const toResultItem = (
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

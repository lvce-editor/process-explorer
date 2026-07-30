import type {
  ParsedProcessItem,
  ProcessItemWithDepth,
} from '../ProcessItem/ProcessItem.ts'
import * as GetAccurateMemoryUsage from '../GetAccurateMemoryUsage/GetAccurateMemoryUsage.ts'
import * as IsMacos from '../IsMacos/IsMacos.ts'

export const addAccurateMemoryUsageForPlatform = async (
  process: ParsedProcessItem,
  isMacOs: boolean,
  getAccurateMemoryUsage: (pid: number) => Promise<number>,
): Promise<ProcessItemWithDepth> => {
  if (isMacOs) {
    return process
  }
  const accurateMemoryUsage = await getAccurateMemoryUsage(process.pid)
  return {
    ...process,
    memory: accurateMemoryUsage,
  }
}

export const addAccurateMemoryUsage = async (
  process: ParsedProcessItem,
): Promise<ProcessItemWithDepth> => {
  return addAccurateMemoryUsageForPlatform(
    process,
    IsMacos.isMacOs,
    GetAccurateMemoryUsage.getAccurateMemoryUsage,
  )
}

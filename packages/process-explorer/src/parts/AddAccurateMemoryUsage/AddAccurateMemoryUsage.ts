import type {
  ParsedProcessItem,
  ProcessItemWithDepth,
} from '../ProcessItem/ProcessItem.ts'
import * as GetAccurateMemoryUsage from '../GetAccurateMemoryUsage/GetAccurateMemoryUsage.ts'

export const addAccurateMemoryUsage = async (
  process: ParsedProcessItem,
): Promise<ProcessItemWithDepth> => {
  const accurateMemoryUsage =
    await GetAccurateMemoryUsage.getAccurateMemoryUsage(process.pid)
  return {
    ...process,
    memory: accurateMemoryUsage,
  }
}

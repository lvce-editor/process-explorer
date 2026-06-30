import * as GetAccurateMemoryUsage from '../GetAccurateMemoryUsage/GetAccurateMemoryUsage.ts'

export const addAccurateMemoryUsage = async (process) => {
  const accurateMemoryUsage =
    await GetAccurateMemoryUsage.getAccurateMemoryUsage(process.pid)
  return {
    ...process,
    memory: accurateMemoryUsage,
  }
}

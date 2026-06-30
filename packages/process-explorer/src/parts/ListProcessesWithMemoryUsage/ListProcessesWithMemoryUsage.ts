import type {
  ProcessItem,
  ProcessItemWithDepth,
} from '../ProcessItem/ProcessItem.ts'
import * as IsWindows from '../IsWindows/IsWindows.ts'

interface ListProcessesWithMemoryUsageModule {
  readonly listProcessesWithMemoryUsage: (
    rootPid: number,
  ) => Promise<readonly ProcessItem[] | readonly ProcessItemWithDepth[]>
}

const getModule = async (): Promise<ListProcessesWithMemoryUsageModule> => {
  if (IsWindows.isWindows) {
    return import('../ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.ts')
  }
  return import('../ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.ts')
}

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
): Promise<readonly ProcessItem[] | readonly ProcessItemWithDepth[]> => {
  const module = await getModule()
  return module.listProcessesWithMemoryUsage(rootPid)
}

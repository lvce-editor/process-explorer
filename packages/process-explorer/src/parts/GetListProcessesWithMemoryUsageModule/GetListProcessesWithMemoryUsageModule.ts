import type {
  ProcessItem,
  ProcessItemWithDepth,
} from '../ProcessItem/ProcessItem.ts'
import * as IsWindows from '../IsWindows/IsWindows.ts'

export interface ListProcessesWithMemoryUsageModule {
  readonly listProcessesWithMemoryUsage: (
    rootPid: number,
  ) => Promise<readonly ProcessItem[] | readonly ProcessItemWithDepth[]>
}

export const getModule =
  async (): Promise<ListProcessesWithMemoryUsageModule> => {
    if (IsWindows.isWindows) {
      return import('../ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.ts')
    }
    return import('../ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.ts')
  }

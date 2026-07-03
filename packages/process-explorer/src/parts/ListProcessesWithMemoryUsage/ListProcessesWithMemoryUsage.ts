import type {
  ProcessItem,
  ProcessItemWithDepth,
} from '../ProcessItem/ProcessItem.ts'
import * as GetListProcessesWithMemoryUsageModule from '../GetListProcessesWithMemoryUsageModule/GetListProcessesWithMemoryUsageModule.ts'

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
  includeElectronData = true,
): Promise<readonly ProcessItem[] | readonly ProcessItemWithDepth[]> => {
  const module = await GetListProcessesWithMemoryUsageModule.getModule()
  return module.listProcessesWithMemoryUsage(rootPid, includeElectronData)
}

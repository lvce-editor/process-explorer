import type { PidMap } from '../PidMap/PidMap.ts'
import type { ProcessItemWithDepth } from '../ProcessItem/ProcessItem.ts'
import * as CreatePidMap from '../CreatePidMap/CreatePidMap.ts'
import * as GetPsOutput from '../GetPsOutput/GetPsOutput.ts'
import * as HasPositiveMemoryUsage from '../HasPositiveMemoryUsage/HasPositiveMemoryUsage.ts'
import * as IsMacos from '../IsMacos/IsMacos.ts'
import * as ListProcessesWithMemoryUsageLinux from '../ListProcessesWithMemoryUsageLinux/ListProcessesWithMemoryUsageLinux.ts'
import * as ParsePsOutput from '../ParsePsOutput/ParsePsOutput.ts'

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
  includeElectronData = true,
  electronPidMap?: PidMap,
): Promise<readonly ProcessItemWithDepth[]> => {
  const pidMap =
    electronPidMap ??
    (includeElectronData ? await CreatePidMap.createPidMap() : {})
  if (!IsMacos.isMacOs) {
    return ListProcessesWithMemoryUsageLinux.listProcessesWithMemoryUsage(
      rootPid,
      pidMap,
    )
  }
  // console.time('getPsOutput')
  const stdout = await GetPsOutput.getPsOutput()
  // console.log({ stdout })
  // console.timeEnd('getPsOutput')
  // console.time('parsePsOutput')
  const parsed = ParsePsOutput.parsePsOutput(stdout, rootPid, pidMap)
  // console.timeEnd('parsePsOutput')
  const filtered = parsed.filter(HasPositiveMemoryUsage.hasPositiveMemoryUsage)
  return filtered
}

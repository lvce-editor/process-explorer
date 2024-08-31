import * as IsWindows from '../IsWindows/IsWindows.ts'

const getModule = () => {
  if (IsWindows.isWindows) {
    return import(
      '../ListProcessesWithMemoryUsageWindows/ListProcessesWithMemoryUsageWindows.ts'
    )
  }
  return import(
    '../ListProcessesWithMemoryUsageUnix/ListProcessesWithMemoryUsageUnix.ts'
  )
}

export const listProcessesWithMemoryUsage = async (rootPid) => {
  const module = await getModule()
  return module.listProcessesWithMemoryUsage(rootPid)
}

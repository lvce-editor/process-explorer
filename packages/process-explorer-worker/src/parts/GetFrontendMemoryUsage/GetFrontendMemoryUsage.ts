import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'
import * as GetMeasureMemory from '../GetMeasureMemory/GetMeasureMemory.ts'
import * as IsValidMemoryValue from '../IsValidMemoryValue/IsValidMemoryValue.ts'
import * as ToBreakdownProcess from '../ToBreakdownProcess/ToBreakdownProcess.ts'
import * as WindowPid from '../WindowPid/WindowPid.ts'

export const getFrontendMemoryUsage = async (
  rootPid: number,
): Promise<readonly ProcessInfo[]> => {
  const measureMemory = GetMeasureMemory.getMeasureMemory()
  if (!measureMemory) {
    return []
  }
  try {
    const measurement = await measureMemory()
    if (!IsValidMemoryValue.isValidMemoryValue(measurement.bytes)) {
      return []
    }
    const breakdown = measurement.breakdown || []
    const breakdownProcesses = breakdown
      .filter(
        (entry) =>
          IsValidMemoryValue.isValidMemoryValue(entry.bytes) && entry.bytes > 0,
      )
      .map(ToBreakdownProcess.toBreakdownProcess)
    return [
      {
        cmd: 'window',
        memory: measurement.bytes,
        name: 'window',
        pid: WindowPid.WindowPid,
        ppid: rootPid,
        synthetic: true,
      },
      ...breakdownProcesses,
    ]
  } catch {
    return []
  }
}

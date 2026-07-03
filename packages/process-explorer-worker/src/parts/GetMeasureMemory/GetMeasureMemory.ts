import type { MemoryMeasurement } from '../MemoryMeasurement/MemoryMeasurement.ts'
import type { PerformanceWithMemory } from '../PerformanceWithMemory/PerformanceWithMemory.ts'

export const getMeasureMemory = ():
  (() => Promise<MemoryMeasurement>) | undefined => {
  const { measureUserAgentSpecificMemory } =
    performance as PerformanceWithMemory
  if (typeof measureUserAgentSpecificMemory !== 'function') {
    return undefined
  }
  return measureUserAgentSpecificMemory.bind(performance)
}

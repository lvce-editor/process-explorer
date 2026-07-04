import type { MemoryMeasurement } from '../MemoryMeasurement/MemoryMeasurement.ts'

export interface PerformanceWithMemory extends Performance {
  readonly measureUserAgentSpecificMemory?: () => Promise<MemoryMeasurement>
}

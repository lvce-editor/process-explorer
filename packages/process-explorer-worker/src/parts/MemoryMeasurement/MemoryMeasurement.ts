import type { MemoryBreakdownEntry } from '../MemoryBreakdownEntry/MemoryBreakdownEntry.ts'

export interface MemoryMeasurement {
  readonly breakdown?: readonly MemoryBreakdownEntry[]
  readonly bytes: number
}

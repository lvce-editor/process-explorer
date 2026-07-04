import type { MemoryAttribution } from '../MemoryAttribution/MemoryAttribution.ts'

export interface MemoryBreakdownEntry {
  readonly attribution?: readonly MemoryAttribution[]
  readonly bytes: number
  readonly types?: readonly string[]
}

import type { ProcessInfo } from '../ProcessInfo/ProcessInfo.ts'

interface MemoryAttribution {
  readonly scope?: string
  readonly url?: string
}

interface MemoryBreakdownEntry {
  readonly attribution?: readonly MemoryAttribution[]
  readonly bytes: number
  readonly types?: readonly string[]
}

interface MemoryMeasurement {
  readonly breakdown?: readonly MemoryBreakdownEntry[]
  readonly bytes: number
}

interface PerformanceWithMemory extends Performance {
  readonly measureUserAgentSpecificMemory?: () => Promise<MemoryMeasurement>
}

const WindowPid = -1

const QueryOrHashRegex = /[?#]/

const isValidMemoryValue = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
}

const getMeasureMemory = (): (() => Promise<MemoryMeasurement>) | undefined => {
  const { measureUserAgentSpecificMemory } =
    performance as PerformanceWithMemory
  if (typeof measureUserAgentSpecificMemory !== 'function') {
    return undefined
  }
  return measureUserAgentSpecificMemory.bind(performance)
}

const getUrlName = (url: string): string => {
  if (!url || url === 'cross-origin-url') {
    return url
  }
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    return parts.at(-1) || parsed.hostname || url
  } catch {
    const withoutQuery = url.split(QueryOrHashRegex, 1)[0]
    const parts = withoutQuery.split('/').filter(Boolean)
    return parts.at(-1) || url
  }
}

const getAttributionName = (attribution: MemoryAttribution): string => {
  const scope = attribution.scope || 'memory'
  const url = attribution.url ? getUrlName(attribution.url) : ''
  if (url) {
    return `${scope}: ${url}`
  }
  return scope
}

const getBreakdownName = (
  entry: MemoryBreakdownEntry,
  index: number,
): string => {
  if (entry.attribution && entry.attribution.length > 0) {
    return entry.attribution.map(getAttributionName).join(', ')
  }
  if (entry.types && entry.types.length > 0) {
    return entry.types.join(', ')
  }
  return `breakdown ${index + 1}`
}

const toBreakdownProcess = (
  entry: MemoryBreakdownEntry,
  index: number,
): ProcessInfo => {
  const name = getBreakdownName(entry, index)
  return {
    cmd: name,
    memory: entry.bytes,
    name,
    pid: -2 - index,
    ppid: WindowPid,
    synthetic: true,
  }
}

export const getFrontendMemoryUsage = async (
  rootPid: number,
): Promise<readonly ProcessInfo[]> => {
  const measureMemory = getMeasureMemory()
  if (!measureMemory) {
    return []
  }
  try {
    const measurement = await measureMemory()
    if (!isValidMemoryValue(measurement.bytes)) {
      return []
    }
    const breakdown = measurement.breakdown || []
    const breakdownProcesses = breakdown
      .filter((entry) => isValidMemoryValue(entry.bytes) && entry.bytes > 0)
      .map(toBreakdownProcess)
    return [
      {
        cmd: 'window',
        memory: measurement.bytes,
        name: 'window',
        pid: WindowPid,
        ppid: rootPid,
        synthetic: true,
      },
      ...breakdownProcesses,
    ]
  } catch {
    return []
  }
}

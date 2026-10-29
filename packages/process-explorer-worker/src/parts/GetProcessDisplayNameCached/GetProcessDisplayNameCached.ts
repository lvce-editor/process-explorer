import type {
  DisplayNameCache,
  DisplayNameCacheEntry,
} from '../DisplayNameCache/DisplayNameCache.ts'
import * as ConfiguredProcessNames from '../ConfiguredProcessNames/ConfiguredProcessNames.ts'
import * as GetFallbackPatternName from '../GetFallbackPatternName/GetFallbackPatternName.ts'
import * as GetProcessDisplayName from '../GetProcessDisplayName/GetProcessDisplayName.ts'
import * as GetPatternName from '../GetPatternName/GetPatternName.ts'

const maxDisplayNameCacheSize = 1000

const getCacheEntry = (cmd: string): DisplayNameCacheEntry => {
  const patternName = GetPatternName.getPatternName(cmd)
  if (patternName) {
    return { name: patternName, usesPidMap: false }
  }
  const configuredProcessName =
    ConfiguredProcessNames.getConfiguredProcessName(cmd)
  if (configuredProcessName) {
    return { name: configuredProcessName, usesPidMap: false }
  }
  return {
    name: GetFallbackPatternName.getFallbackPatternName(cmd) || cmd,
    usesPidMap: true,
  }
}

export const getName = (
  pid: number,
  cmd: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
  displayNameCache: DisplayNameCache,
): string => {
  if (pid === rootPid) {
    return 'main'
  }
  let entry = displayNameCache[cmd]
  if (!entry) {
    entry = getCacheEntry(cmd)
    displayNameCache[cmd] = entry
  }
  if (entry.usesPidMap && pid in pidMap) {
    return GetProcessDisplayName.getPidMapName(pid, pidMap)
  }
  return entry.name
}

export const trimCache = (
  displayNameCache: DisplayNameCache,
): DisplayNameCache => {
  const keys = Object.keys(displayNameCache)
  if (keys.length <= maxDisplayNameCacheSize) {
    return displayNameCache
  }
  return Object.fromEntries(
    keys
      .slice(keys.length - maxDisplayNameCacheSize)
      .map((key) => [key, displayNameCache[key]]),
  )
}

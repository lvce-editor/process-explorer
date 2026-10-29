import * as ConfiguredProcessNames from '../ConfiguredProcessNames/ConfiguredProcessNames.ts'
import * as GetFallbackPatternName from '../GetFallbackPatternName/GetFallbackPatternName.ts'
import * as GetPatternName from '../GetPatternName/GetPatternName.ts'

const remoteSshProcessNames = new Set([
  'extension-builtin.remote-ssh:remote-SSH',
  'extension-builtin.remote-ssh:-remote-SSH',
])

export const getPidMapName = (
  pid: number,
  pidMap: Readonly<Record<number, string>>,
): string => {
  const processName = pidMap[pid] || '<unknown>'
  if (remoteSshProcessNames.has(processName)) {
    return 'remote-ssh'
  }
  return processName
}

export const getName = (
  pid: number,
  cmd: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): string => {
  if (pid === rootPid) {
    return 'main'
  }
  const patternName = GetPatternName.getPatternName(cmd)
  if (patternName) {
    return patternName
  }
  const configuredProcessName =
    ConfiguredProcessNames.getConfiguredProcessName(cmd)
  if (configuredProcessName) {
    return configuredProcessName
  }
  if (pid in pidMap) {
    return getPidMapName(pid, pidMap)
  }
  const fallbackPatternName = GetFallbackPatternName.getFallbackPatternName(cmd)
  return fallbackPatternName || cmd
}

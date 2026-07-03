import * as Assert from '../Assert/Assert.ts'
import * as GetFallbackPatternName from '../GetFallbackPatternName/GetFallbackPatternName.ts'
import * as GetPatternName from '../GetPatternName/GetPatternName.ts'

export const getName = (
  pid: number,
  cmd: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): string => {
  Assert.number(pid)
  Assert.string(cmd)
  Assert.number(rootPid)
  Assert.object(pidMap)
  if (pid === rootPid) {
    return 'main'
  }
  const patternName = GetPatternName.getPatternName(cmd)
  if (patternName) {
    return patternName
  }
  if (pid in pidMap) {
    return pidMap[pid] || '<unknown>'
  }
  const fallbackPatternName = GetFallbackPatternName.getFallbackPatternName(cmd)
  if (fallbackPatternName) {
    return fallbackPatternName
  }
  return cmd
}

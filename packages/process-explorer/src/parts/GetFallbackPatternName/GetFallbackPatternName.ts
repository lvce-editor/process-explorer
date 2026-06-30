import * as FallbackProcessNamePatterns from '../FallbackProcessNamePatterns/FallbackProcessNamePatterns.ts'

export const getFallbackPatternName = (cmd: string): string => {
  return (
    FallbackProcessNamePatterns.fallbackProcessNamePatterns.find((pattern) =>
      pattern.matches(cmd),
    )?.name || ''
  )
}

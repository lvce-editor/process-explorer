import * as ProcessNamePatterns from '../ProcessNamePatterns/ProcessNamePatterns.ts'

export const getPatternName = (cmd: string): string => {
  return (
    ProcessNamePatterns.processNamePatterns.find((pattern) =>
      pattern.matches(cmd),
    )?.name || ''
  )
}

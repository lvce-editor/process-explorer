import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'

export const getUniqueDepths = (
  visibleProcesses: readonly VisibleProcess[],
): readonly number[] => {
  return [...new Set(visibleProcesses.map((process) => process.depth))]
}

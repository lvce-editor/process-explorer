import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'
import { unique } from '../Unique/Unique.ts'

export const getUniqueIndents = (
  visibleProcesses: readonly VisibleProcess[],
  previous: readonly number[],
): readonly number[] => {
  const next = unique(
    visibleProcesses.map((process) => process.depth),
  ).toSorted((a, b) => a - b)
  if (
    previous.length === next.length &&
    previous.every((depth, index) => depth === next[index])
  ) {
    return previous
  }
  return next
}

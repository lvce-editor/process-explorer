import type { VisibleProcess } from '../VisibleProcess/VisibleProcess.ts'

export const getUniqueIndents = (
  visibleProcesses: readonly VisibleProcess[],
  previous: readonly number[],
): readonly number[] => {
  const next = [...new Set(visibleProcesses.map((process) => process.depth))].sort(
    (a, b) => a - b,
  )
  if (
    previous.length === next.length &&
    previous.every((depth, index) => depth === next[index])
  ) {
    return previous
  }
  return next
}

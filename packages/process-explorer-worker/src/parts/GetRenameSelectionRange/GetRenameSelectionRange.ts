import type { Selection } from '../Selection/Selection.ts'

export const getRenameSelectionRange = (name: string): Selection => {
  const dotIndex = name.lastIndexOf('.')
  if (dotIndex === -1) {
    return {
      end: name.length,
      start: 0,
    }
  }
  return {
    end: dotIndex,
    start: 0,
  }
}

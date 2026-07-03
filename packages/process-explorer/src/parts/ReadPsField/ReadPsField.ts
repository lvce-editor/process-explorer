import type { PsField } from '../PsField/PsField.ts'
import * as IsSpace from '../IsSpace/IsSpace.ts'

export const readField = (line: string, startIndex: number): PsField => {
  let start = startIndex
  while (start < line.length && IsSpace.isSpace(line[start])) {
    start++
  }
  let end = start
  while (end < line.length && !IsSpace.isSpace(line[end])) {
    end++
  }
  return {
    nextIndex: end,
    value: line.slice(start, end),
  }
}

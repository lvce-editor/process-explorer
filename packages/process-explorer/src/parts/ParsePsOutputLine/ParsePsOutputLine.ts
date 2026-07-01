import type { ParsedPsLine } from '../ParsedPsLine/ParsedPsLine.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ReadPsField from '../ReadPsField/ReadPsField.ts'

export const parsePsOutputLine = (line: string): ParsedPsLine => {
  Assert.string(line)
  const trimmedLine = line.trim()
  const pidField = ReadPsField.readField(trimmedLine, 0)
  const ppidField = ReadPsField.readField(trimmedLine, pidField.nextIndex)
  const loadField = ReadPsField.readField(trimmedLine, ppidField.nextIndex)
  const memoryField = ReadPsField.readField(trimmedLine, loadField.nextIndex)
  const cmd = trimmedLine.slice(memoryField.nextIndex).trim()
  if (
    pidField.value &&
    ppidField.value &&
    loadField.value &&
    memoryField.value &&
    cmd
  ) {
    return {
      cmd,
      pid: Number.parseInt(pidField.value),
      ppid: Number.parseInt(ppidField.value),
    }
  }
  throw new Error(`line could not be parsed: ${line}`)
}

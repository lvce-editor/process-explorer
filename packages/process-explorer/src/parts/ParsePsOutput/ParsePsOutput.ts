// parse ps output based on vscode https://github.com/microsoft/vscode/blob/c0769274fa136b45799edeccc0d0a2f645b75caf/src/vs/base/node/ps.ts (License MIT)

import type { ParsedProcessItem } from '../ProcessItem/ProcessItem.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Character from '../Character/Character.ts'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

interface ParsedPsLine {
  readonly cmd: string
  readonly pid: number
  readonly ppid: number
}

interface PsField {
  readonly nextIndex: number
  readonly value: string
}

const isSpace = (character: string): boolean => {
  return character === ' ' || character === '\t'
}

const readField = (line: string, startIndex: number): PsField => {
  let start = startIndex
  while (start < line.length && isSpace(line[start])) {
    start++
  }
  let end = start
  while (end < line.length && !isSpace(line[end])) {
    end++
  }
  return {
    nextIndex: end,
    value: line.slice(start, end),
  }
}

const parsePsOutputLine = (line: string): ParsedPsLine => {
  Assert.string(line)
  const trimmedLine = line.trim()
  const pidField = readField(trimmedLine, 0)
  const ppidField = readField(trimmedLine, pidField.nextIndex)
  const loadField = readField(trimmedLine, ppidField.nextIndex)
  const memoryField = readField(trimmedLine, loadField.nextIndex)
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

export const parsePsOutput = (
  stdout: string,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): readonly ParsedProcessItem[] => {
  Assert.string(stdout)
  Assert.number(rootPid)
  Assert.object(pidMap)
  if (stdout === Character.EmptyString) {
    return []
  }
  const lines = SplitLines.splitLines(stdout)
  const result: ParsedProcessItem[] = []
  const depthMap = Object.create(null)
  depthMap[rootPid] = 1
  const parsedLines = lines.map(parsePsOutputLine)
  for (const parsedLine of parsedLines) {
    const { cmd, pid, ppid } = parsedLine
    const depth = pid === rootPid ? 1 : depthMap[ppid]
    if (!depth) {
      continue
    }
    result.push({
      ...parsedLine,
      depth,
      name: ListProcessGetName.getName(pid, cmd, rootPid, pidMap),
    })
    depthMap[pid] = depth + 1
  }
  return result
}

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import type { PidMap } from '../PidMap/PidMap.ts'
import type { ProcessItemWithDepth } from '../ProcessItem/ProcessItem.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.ts'
import * as ListProcessGetName from '../ListProcessGetName/ListProcessGetName.ts'

interface ProcessStat {
  readonly command: string
  readonly memory: number
  readonly pid: number
  readonly ppid: number
}

interface ProcessStatWithDepth extends ProcessStat {
  readonly depth: number
}

const pageSize = 4096
const processDirectory = '/proc'
const processIdRegex = /^\d+$/

const isMissingProcessError = (error: unknown): boolean => {
  return IsEnoentError.isEnoentError(error) || IsEsrchError.isEsrchError(error)
}

const readNumberField = (
  content: string,
  startIndex: number,
): { readonly endIndex: number; readonly value: number } => {
  const endIndex = content.indexOf(' ', startIndex)
  const actualEndIndex = endIndex === -1 ? content.length : endIndex
  return {
    endIndex: actualEndIndex,
    value: Number.parseInt(content.slice(startIndex, actualEndIndex)),
  }
}

const parseStat = (content: string): ProcessStat => {
  const commandStartIndex = content.indexOf('(')
  const commandEndIndex = content.lastIndexOf(')')
  if (commandStartIndex === -1 || commandEndIndex === -1) {
    throw new TypeError('Invalid process stat')
  }
  const pid = Number.parseInt(content.slice(0, commandStartIndex).trim())
  const command = content.slice(commandStartIndex + 1, commandEndIndex)
  let fieldIndex = 3
  let startIndex = commandEndIndex + 2
  let ppid = 0
  let residentPages = 0
  while (fieldIndex <= 24) {
    const field = readNumberField(content, startIndex)
    if (fieldIndex === 4) {
      ppid = field.value
    } else if (fieldIndex === 24) {
      residentPages = field.value
    }
    fieldIndex++
    startIndex = field.endIndex + 1
  }
  if (
    !Number.isFinite(pid) ||
    !Number.isFinite(ppid) ||
    !Number.isFinite(residentPages)
  ) {
    throw new TypeError('Invalid process stat')
  }
  return {
    command,
    memory: residentPages * pageSize,
    pid,
    ppid,
  }
}

const readStat = (pid: string): ProcessStat | undefined => {
  try {
    const content = readFileSync(join(processDirectory, pid, 'stat'), 'utf8')
    return parseStat(content)
  } catch (error) {
    if (isMissingProcessError(error)) {
      return undefined
    }
    throw error
  }
}

const getProcessStats = (): readonly ProcessStat[] => {
  const entries = readdirSync(processDirectory)
  const processIds = entries.filter((entry) => processIdRegex.test(entry))
  const stats = processIds.map(readStat)
  return stats.filter((stat): stat is ProcessStat => Boolean(stat))
}

const getProcessTree = (
  stats: readonly ProcessStat[],
  rootPid: number,
): readonly ProcessStatWithDepth[] => {
  const statsByPid = new Map(stats.map((stat) => [stat.pid, stat]))
  const childrenByParentPid = new Map<number, ProcessStat[]>()
  for (const stat of stats) {
    const children = childrenByParentPid.get(stat.ppid)
    if (children) {
      children.push(stat)
    } else {
      childrenByParentPid.set(stat.ppid, [stat])
    }
  }
  const root = statsByPid.get(rootPid)
  const pending: ProcessStatWithDepth[] = root
    ? [{ ...root, depth: 1 }]
    : (childrenByParentPid.get(rootPid) || []).map((stat) => ({
        ...stat,
        depth: 1,
      }))
  const result: ProcessStatWithDepth[] = []
  while (pending.length > 0) {
    const current = pending.pop()!
    result.push(current)
    const children = childrenByParentPid.get(current.pid) || []
    for (const child of children) {
      pending.push({
        ...child,
        depth: current.depth + 1,
      })
    }
  }
  return result.toSorted((a, b) => a.pid - b.pid)
}

const readCommandLine = (process: ProcessStatWithDepth): string | undefined => {
  try {
    const content = readFileSync(
      join(processDirectory, String(process.pid), 'cmdline'),
      'utf8',
    )
    return content.replaceAll('\0', ' ').trim() || process.command
  } catch (error) {
    if (isMissingProcessError(error)) {
      return undefined
    }
    throw error
  }
}

const addCommandLine = (
  process: ProcessStatWithDepth,
  rootPid: number,
  pidMap: PidMap,
): ProcessItemWithDepth | undefined => {
  const cmd = readCommandLine(process)
  if (cmd === undefined) {
    return undefined
  }
  return {
    cmd,
    depth: process.depth,
    memory: process.memory,
    name: ListProcessGetName.getName(process.pid, cmd, rootPid, pidMap),
    pid: process.pid,
    ppid: process.ppid,
  }
}

export const listProcessesWithMemoryUsage = async (
  rootPid: number,
  pidMap: PidMap,
): Promise<readonly ProcessItemWithDepth[]> => {
  const stats = getProcessStats()
  const processTree = getProcessTree(stats, rootPid)
  const processes = processTree.map((process) =>
    addCommandLine(process, rootPid, pidMap),
  )
  return processes.filter((process): process is ProcessItemWithDepth =>
    Boolean(process),
  )
}

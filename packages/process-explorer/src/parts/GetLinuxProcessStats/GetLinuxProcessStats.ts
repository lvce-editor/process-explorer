import { readdirSync } from 'node:fs'
import type { LinuxProcessStat } from '../LinuxProcessStat/LinuxProcessStat.ts'
import * as ReadLinuxProcessStat from '../ReadLinuxProcessStat/ReadLinuxProcessStat.ts'

const processDirectory = '/proc'
const processIdRegex = /^\d+$/

export const getLinuxProcessStats = (): readonly LinuxProcessStat[] => {
  const entries = readdirSync(processDirectory)
  const result: LinuxProcessStat[] = []
  for (const entry of entries) {
    if (!processIdRegex.test(entry)) {
      continue
    }
    const stat = ReadLinuxProcessStat.readLinuxProcessStat(entry)
    if (stat) {
      result.push(stat)
    }
  }
  return result
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import * as ParseLinuxProcessPss from '../ParseLinuxProcessPss/ParseLinuxProcessPss.ts'

const processDirectory = '/proc'

export const readLinuxProcessPss = (pid: number): number | undefined => {
  try {
    const content = readFileSync(
      join(processDirectory, String(pid), 'smaps_rollup'),
      'utf8',
    )
    return ParseLinuxProcessPss.parseLinuxProcessPss(content)
  } catch {
    return undefined
  }
}

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { LinuxProcessStat } from '../LinuxProcessStat/LinuxProcessStat.ts'
import * as IsMissingProcessError from '../IsMissingProcessError/IsMissingProcessError.ts'
import * as ParseLinuxProcessStat from '../ParseLinuxProcessStat/ParseLinuxProcessStat.ts'

const processDirectory = '/proc'

export const readLinuxProcessStat = (
  pid: string,
): LinuxProcessStat | undefined => {
  try {
    const content = readFileSync(join(processDirectory, pid, 'stat'), 'utf8')
    return ParseLinuxProcessStat.parseLinuxProcessStat(content)
  } catch (error) {
    if (IsMissingProcessError.isMissingProcessError(error)) {
      return undefined
    }
    throw error
  }
}

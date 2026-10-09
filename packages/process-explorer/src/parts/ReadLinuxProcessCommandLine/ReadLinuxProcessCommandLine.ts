import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { LinuxProcessStatWithDepth } from '../LinuxProcessStatWithDepth/LinuxProcessStatWithDepth.ts'
import * as IsMissingProcessError from '../IsMissingProcessError/IsMissingProcessError.ts'

const processDirectory = '/proc'

export const readLinuxProcessCommandLine = (
  process: LinuxProcessStatWithDepth,
): string | undefined => {
  try {
    const content = readFileSync(
      join(processDirectory, String(process.pid), 'cmdline'),
      'utf8',
    )
    const commandLine = content.replaceAll('\0', ' ').trim()
    if (commandLine) {
      return commandLine
    }
    return process.command
  } catch (error) {
    if (IsMissingProcessError.isMissingProcessError(error)) {
      return undefined
    }
    throw error
  }
}

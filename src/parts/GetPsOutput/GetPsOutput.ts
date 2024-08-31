import { execFile as _execFile } from 'node:child_process'
import { promisify } from 'node:util'
import * as Signal from '../Signal/Signal.ts'
import { VError } from '../VError/VError.ts'

const execFile = promisify(_execFile)

export const getPsOutput = async () => {
  try {
    const { stdout } = await execFile('ps', [
      '-ax',
      '-o',
      'pid=,ppid=,pcpu=,pmem=,command=',
    ])
    return stdout.trim()
  } catch (error) {
    // @ts-ignore
    if (error && error.signal === Signal.SIGINT) {
      return ''
    }
    throw new VError(error, `Failed to execute ps`)
  }
}

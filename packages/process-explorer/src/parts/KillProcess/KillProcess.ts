import * as Process from '../Process/Process.ts'
import * as Signal from '../Signal/Signal.ts'

export const killProcess = (pid: number): void => {
  Process.kill(pid, Signal.SIGTERM)
}

import * as GetInspectorWebSocketUrl from '../GetInspectorWebSocketUrl/GetInspectorWebSocketUrl.ts'
import * as Process from '../Process/Process.ts'
import * as Signal from '../Signal/Signal.ts'

export const debugProcess = async (
  pid: number,
  command: string,
): Promise<string> => {
  Process.kill(pid, Signal.SIGUSR1)
  return GetInspectorWebSocketUrl.getInspectorWebSocketUrl(pid, command)
}

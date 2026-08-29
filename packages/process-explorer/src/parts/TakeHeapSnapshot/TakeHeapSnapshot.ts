import { createWriteStream } from 'node:fs'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { WebSocket } from 'ws'
import * as GetInspectorWebSocketUrl from '../GetInspectorWebSocketUrl/GetInspectorWebSocketUrl.ts'
import * as Process from '../Process/Process.ts'
import * as Signal from '../Signal/Signal.ts'
import * as TakeHeapSnapshotWithCdp from '../TakeHeapSnapshotWithCdp/TakeHeapSnapshotWithCdp.ts'

export const takeHeapSnapshot = async (
  pid: number,
  command: string,
): Promise<string> => {
  Process.kill(pid, Signal.SIGUSR1)
  const inspectorUrl = await GetInspectorWebSocketUrl.getInspectorWebSocketUrl(
    pid,
    command,
  )
  const path = join(tmpdir(), `lvce-process-${pid}-${Date.now()}.heapsnapshot`)
  const webSocket = new WebSocket(inspectorUrl)
  const output = createWriteStream(path)
  try {
    await TakeHeapSnapshotWithCdp.takeHeapSnapshotWithCdp(webSocket, output)
    return path
  } catch (error) {
    await rm(path, { force: true })
    throw error
  }
}

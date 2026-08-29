import type { WriteStream } from 'node:fs'
import type { RawData, WebSocket } from 'ws'

interface CdpMessage {
  readonly error?: {
    readonly message: string
  }
  readonly id?: number
  readonly method?: string
  readonly params?: {
    readonly chunk: string
  }
}

const commandId = 1
const timeoutMs = 5 * 60 * 1000

export const takeHeapSnapshotWithCdp = (
  webSocket: WebSocket,
  output: WriteStream,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let settled = false
    const timeout = setTimeout(() => {
      fail(new Error('Timed out while taking the heap snapshot'))
    }, timeoutMs)

    const dispose = (): void => {
      clearTimeout(timeout)
      webSocket.close()
    }

    const fail = (error: Error): void => {
      if (settled) {
        return
      }
      settled = true
      output.destroy()
      dispose()
      reject(error)
    }

    output.on('error', fail)
    webSocket.on('error', fail)
    webSocket.on('close', () => {
      fail(new Error('Inspector connection closed while taking heap snapshot'))
    })
    webSocket.on('message', (data: RawData) => {
      try {
        const message = JSON.parse((data as Buffer).toString()) as CdpMessage
        if (message.method === 'HeapProfiler.addHeapSnapshotChunk') {
          const chunk = message.params?.chunk as string
          if (!output.write(chunk)) {
            webSocket.pause()
            output.once('drain', () => webSocket.resume())
          }
          return
        }
        if (message.id !== commandId) {
          return
        }
        if (message.error) {
          fail(new Error(message.error.message))
          return
        }
        output.end(() => {
          if (settled) {
            return
          }
          settled = true
          dispose()
          resolve()
        })
      } catch (error) {
        fail(new Error('Failed to handle inspector message', { cause: error }))
      }
    })
    webSocket.on('open', () => {
      webSocket.send(
        JSON.stringify({
          id: commandId,
          method: 'HeapProfiler.takeHeapSnapshot',
          params: {
            reportProgress: false,
          },
        }),
      )
    })
  })
}

import { WebSocket, type RawData } from 'ws'

interface RuntimeEvaluateMessage {
  readonly id?: number
  readonly result?: {
    readonly result?: {
      readonly value?: unknown
    }
  }
}

const commandId = 1
const timeoutMs = 2000

export const getInspectorProcessId = (url: string): Promise<number> => {
  return new Promise((resolve) => {
    const webSocket = new WebSocket(url)
    let settled = false
    const finish = (pid: number): void => {
      if (settled) {
        return
      }
      settled = true
      clearTimeout(timeout)
      webSocket.close()
      resolve(pid)
    }
    const timeout = setTimeout(finish, timeoutMs, 0)

    webSocket.on('error', () => finish(0))
    webSocket.on('close', () => finish(0))
    webSocket.on('message', (data: RawData) => {
      try {
        const message = JSON.parse(
          (data as Buffer).toString(),
        ) as RuntimeEvaluateMessage
        if (message.id !== commandId) {
          return
        }
        const value = message.result?.result?.value
        finish(typeof value === 'number' ? value : 0)
      } catch {
        finish(0)
      }
    })
    webSocket.on('open', () => {
      webSocket.send(
        JSON.stringify({
          id: commandId,
          method: 'Runtime.evaluate',
          params: {
            expression: 'process.pid',
            returnByValue: true,
          },
        }),
      )
    })
  })
}

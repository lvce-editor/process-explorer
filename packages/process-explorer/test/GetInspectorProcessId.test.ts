import type { AddressInfo } from 'node:net'
import { expect, test } from '@jest/globals'
import { once } from 'node:events'
import { type WebSocket, WebSocketServer } from 'ws'
import * as GetInspectorProcessId from '../src/parts/GetInspectorProcessId/GetInspectorProcessId.ts'

interface TestServer {
  readonly close: () => Promise<void>
  readonly url: string
}

const createTestServer = async (
  respond: (webSocket: WebSocket) => void,
): Promise<TestServer> => {
  const server = new WebSocketServer({ port: 0 })
  await once(server, 'listening')
  server.on('connection', (webSocket) => {
    webSocket.on('message', () => respond(webSocket))
  })
  const { port } = server.address() as AddressInfo
  return {
    close: () =>
      new Promise((resolve) => {
        server.close(() => resolve())
      }),
    url: `ws://127.0.0.1:${port}`,
  }
}

test('gets the process id from the inspector', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.send(
      JSON.stringify({ id: 1, result: { result: { value: 123 } } }),
    )
  })
  try {
    await expect(
      GetInspectorProcessId.getInspectorProcessId(server.url),
    ).resolves.toBe(123)
  } finally {
    await server.close()
  }
})

test('returns zero for a non-number process id', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.send(
      JSON.stringify({ id: 1, result: { result: { value: 'unknown' } } }),
    )
  })
  try {
    await expect(
      GetInspectorProcessId.getInspectorProcessId(server.url),
    ).resolves.toBe(0)
  } finally {
    await server.close()
  }
})

test('returns zero for an invalid inspector message', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.send('invalid json')
  })
  try {
    await expect(
      GetInspectorProcessId.getInspectorProcessId(server.url),
    ).resolves.toBe(0)
  } finally {
    await server.close()
  }
})

test('returns zero when the inspector cannot be reached', async () => {
  await expect(
    GetInspectorProcessId.getInspectorProcessId('ws://127.0.0.1:1'),
  ).resolves.toBe(0)
})

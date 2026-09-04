import type { AddressInfo } from 'node:net'
import { expect, test } from '@jest/globals'
import { once } from 'node:events'
import { createWriteStream } from 'node:fs'
import { readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { WebSocket, type WebSocket as WebSocketType, WebSocketServer } from 'ws'
import * as TakeHeapSnapshotWithCdp from '../src/parts/TakeHeapSnapshotWithCdp/TakeHeapSnapshotWithCdp.ts'

interface TestServer {
  readonly close: () => Promise<void>
  readonly url: string
}

const createTestServer = async (
  respond: (webSocket: WebSocketType) => void,
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

const getSnapshotPath = (): string => {
  return join(
    tmpdir(),
    `lvce-process-cdp-test-${process.pid}-${Date.now()}-${Math.random()}.heapsnapshot`,
  )
}

test('streams heap snapshot chunks into the output file', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.send(JSON.stringify({ id: 2, result: {} }))
    webSocket.send(
      JSON.stringify({
        method: 'HeapProfiler.addHeapSnapshotChunk',
        params: { chunk: 'first' },
      }),
    )
    webSocket.send(
      JSON.stringify({
        method: 'HeapProfiler.addHeapSnapshotChunk',
        params: { chunk: 'second' },
      }),
    )
    webSocket.send(JSON.stringify({ id: 1, result: {} }))
  })
  const path = getSnapshotPath()
  try {
    await TakeHeapSnapshotWithCdp.takeHeapSnapshotWithCdp(
      new WebSocket(server.url),
      createWriteStream(path),
    )
    await expect(readFile(path, 'utf8')).resolves.toBe('firstsecond')
  } finally {
    await server.close()
    await rm(path, { force: true })
  }
})

test('reports an inspector error', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.send(
      JSON.stringify({ error: { message: 'snapshot failed' }, id: 1 }),
    )
  })
  const path = getSnapshotPath()
  try {
    await expect(
      TakeHeapSnapshotWithCdp.takeHeapSnapshotWithCdp(
        new WebSocket(server.url),
        createWriteStream(path),
      ),
    ).rejects.toThrow('snapshot failed')
  } finally {
    await server.close()
    await rm(path, { force: true })
  }
})

test('reports an invalid inspector message', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.send('invalid json')
  })
  const path = getSnapshotPath()
  try {
    await expect(
      TakeHeapSnapshotWithCdp.takeHeapSnapshotWithCdp(
        new WebSocket(server.url),
        createWriteStream(path),
      ),
    ).rejects.toThrow('Failed to handle inspector message')
  } finally {
    await server.close()
    await rm(path, { force: true })
  }
})

test('reports an inspector connection that closes early', async () => {
  const server = await createTestServer((webSocket) => {
    webSocket.close()
  })
  const path = getSnapshotPath()
  try {
    await expect(
      TakeHeapSnapshotWithCdp.takeHeapSnapshotWithCdp(
        new WebSocket(server.url),
        createWriteStream(path),
      ),
    ).rejects.toThrow('Inspector connection closed while taking heap snapshot')
  } finally {
    await server.close()
    await rm(path, { force: true })
  }
})

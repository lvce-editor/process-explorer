import { afterEach, expect, jest, test } from '@jest/globals'
import * as GetInspectorWebSocketUrl from '../src/parts/GetInspectorWebSocketUrl/GetInspectorWebSocketUrl.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('gets the matching node inspector websocket url', async () => {
  const fetch = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
    Response.json([
      {
        title: 'node[123]',
        webSocketDebuggerUrl: 'ws://127.0.0.1:9229/target',
      },
    ]),
  )

  await expect(
    GetInspectorWebSocketUrl.getInspectorWebSocketUrlAtPort(123, 9229),
  ).resolves.toBe('ws://127.0.0.1:9229/target')
  expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:9229/json/list', {
    signal: expect.any(AbortSignal),
  })
})

test('ignores inspector targets for other processes', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(
    Response.json([
      {
        title: 'node[456]',
        webSocketDebuggerUrl: 'ws://127.0.0.1:9229/target',
      },
    ]),
  )

  await expect(
    GetInspectorWebSocketUrl.getInspectorWebSocketUrlAtPort(123, 9229),
  ).resolves.toBe('')
})

test('ignores unsuccessful inspector responses', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response('', {
      status: 500,
    }),
  )

  await expect(
    GetInspectorWebSocketUrl.getInspectorWebSocketUrlAtPort(123, 9229),
  ).resolves.toBe('')
})

test('ignores invalid inspector target lists', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({}))

  await expect(
    GetInspectorWebSocketUrl.getInspectorWebSocketUrlAtPort(123, 9229),
  ).resolves.toBe('')
})

test('finds the inspector using command ports', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue(
    Response.json([
      {
        title: 'node[123]',
        webSocketDebuggerUrl: 'ws://127.0.0.1:9230/target',
      },
    ]),
  )

  await expect(
    GetInspectorWebSocketUrl.getInspectorWebSocketUrl(
      123,
      'node --inspect-port=9230 app.js',
    ),
  ).resolves.toBe('ws://127.0.0.1:9230/target')
})

test('ignores failed inspector requests', async () => {
  jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('not listening'))

  await expect(
    GetInspectorWebSocketUrl.getInspectorWebSocketUrlAtPort(123, 9229),
  ).resolves.toBe('')
})

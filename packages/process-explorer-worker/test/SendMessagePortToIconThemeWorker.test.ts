import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { sendMessagePortToIconThemeWorker } from '../src/parts/SendMessagePortToIconThemeWorker/SendMessagePortToIconThemeWorker.ts'

test('sendMessagePortToIconThemeWorker calls RendererWorker.sendMessagePortToIconThemeWorker with correct parameters', async () => {
  const { port1 } = new MessageChannel()
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.handleMessagePort'() {
      return undefined
    },
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
  })

  await sendMessagePortToIconThemeWorker(port1)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port1, 'IconTheme.handleMessagePort', 0],
  ])
})

test('sendMessagePortToIconThemeWorker handles different port types', async () => {
  const { port1: port1a } = new MessageChannel()
  const { port1: port2a } = new MessageChannel()

  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.handleMessagePort'() {
      return undefined
    },
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
  })

  await sendMessagePortToIconThemeWorker(port1a)
  await sendMessagePortToIconThemeWorker(port2a)

  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port1a, 'IconTheme.handleMessagePort', 0],
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port2a, 'IconTheme.handleMessagePort', 0],
  ])
})

test('sendMessagePortToIconThemeWorker propagates errors from RendererWorker', async () => {
  const { port1 } = new MessageChannel()

  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.handleMessagePort'() {
      return undefined
    },
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      throw new Error('RPC call failed')
    },
  })

  await expect(sendMessagePortToIconThemeWorker(port1)).rejects.toThrow('RPC call failed')
  expect(mockRpc.invocations).toEqual([
    ['SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker', port1, 'IconTheme.handleMessagePort', 0],
  ])
})

test('sendMessagePortToIconThemeWorker returns void when successful', async () => {
  const { port1 } = new MessageChannel()

  RendererWorker.registerMockRpc({
    'IconTheme.handleMessagePort'() {
      return undefined
    },
    'SendMessagePortToExtensionHostWorker.sendMessagePortToIconThemeWorker'() {
      return undefined
    },
  })

  const result = await sendMessagePortToIconThemeWorker(port1)
  expect(result).toBeUndefined()
})

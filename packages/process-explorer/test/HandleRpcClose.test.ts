import type { Rpc } from '@lvce-editor/rpc'
import { afterEach, expect, jest, test } from '@jest/globals'
import { SharedProcess } from '@lvce-editor/rpc-registry'
import * as HandleRpcClose from '../src/parts/HandleRpcClose/HandleRpcClose.ts'

const createRpc = (ipc: unknown): Rpc => {
  return {
    dispose: jest.fn(async () => {}),
    invoke: jest.fn(async () => {}),
    invokeAndTransfer: jest.fn(async () => {}),
    ipc,
    send: jest.fn(),
  } as Rpc
}

afterEach(() => {
  jest.restoreAllMocks()
  process.exitCode = undefined
})

test('handleClose - keeps process alive when ref count remains', async () => {
  const decreaseRefCount = jest.fn(async () => 1)
  using _mockRpc = SharedProcess.registerMockRpc({
    'ProcessExplorer.decreaseRefCount': decreaseRefCount,
  })

  await HandleRpcClose.handleClose()

  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
})

test('handleClose - exits when ref count reaches zero', async () => {
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)
  const decreaseRefCount = jest.fn(async () => 0)
  using _mockRpc = SharedProcess.registerMockRpc({
    'ProcessExplorer.decreaseRefCount': decreaseRefCount,
  })

  await HandleRpcClose.handleClose()

  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
  expect(kill).toHaveBeenCalledWith(process.pid, 'SIGTERM')
  expect(process.exitCode).toBe(0)
})

test('listen - decrements once when rpc closes', async () => {
  const decreaseRefCount = jest.fn(async () => 1)
  using _mockRpc = SharedProcess.registerMockRpc({
    'ProcessExplorer.decreaseRefCount': decreaseRefCount,
  })
  const listeners: Array<() => void> = []
  const ipc = {
    off: jest.fn(),
    on: jest.fn((_event: string, listener: () => void) => {
      listeners.push(listener)
    }),
  }
  const rpc = createRpc(ipc)

  HandleRpcClose.listen(rpc)
  listeners[0]()
  listeners[0]()
  await Promise.resolve()

  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
  expect(ipc.off).toHaveBeenCalledWith('close', listeners[0])
})

test('listen - uses browser event listeners when available', () => {
  const ipc = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }

  HandleRpcClose.listen(createRpc(ipc))

  expect(ipc.addEventListener).toHaveBeenCalledWith(
    'close',
    expect.any(Function),
    { once: true },
  )
})

test('listen - removes the browser close listener when it fires', async () => {
  const decreaseRefCount = jest.fn(async () => 1)
  using _mockRpc = SharedProcess.registerMockRpc({
    'ProcessExplorer.decreaseRefCount': decreaseRefCount,
  })
  let closeListener: (() => void) | undefined
  const ipc = {
    addEventListener: jest.fn((_event: string, listener: () => void) => {
      closeListener = listener
    }),
    removeEventListener: jest.fn(),
  }

  HandleRpcClose.listen(createRpc(ipc))
  closeListener?.()
  await Promise.resolve()

  expect(ipc.removeEventListener).toHaveBeenCalledWith('close', closeListener)
  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
})

test('listen - does nothing when rpc has no ipc', () => {
  const rpc = createRpc(undefined)

  expect(() => HandleRpcClose.listen(rpc)).not.toThrow()
})

test('listen - supports event emitters without an off method', async () => {
  const decreaseRefCount = jest.fn(async () => 1)
  using _mockRpc = SharedProcess.registerMockRpc({
    'ProcessExplorer.decreaseRefCount': decreaseRefCount,
  })
  let closeListener: (() => void) | undefined
  const ipc = {
    on: jest.fn((_event: string, listener: () => void) => {
      closeListener = listener
    }),
  }

  HandleRpcClose.listen(createRpc(ipc))
  closeListener?.()
  await Promise.resolve()

  expect(decreaseRefCount).toHaveBeenCalledTimes(1)
})

test('handleClose - exits when ref count request fails', async () => {
  const kill = jest.spyOn(process, 'kill').mockImplementation(() => true)
  using _mockRpc = SharedProcess.registerMockRpc({
    'ProcessExplorer.decreaseRefCount': async () => {
      throw new Error('shared process unavailable')
    },
  })

  await HandleRpcClose.handleClose()

  expect(kill).toHaveBeenCalledWith(process.pid, 'SIGTERM')
  expect(process.exitCode).toBe(0)
})

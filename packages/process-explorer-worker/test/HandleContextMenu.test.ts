import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('handleContextMenu - close', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({ type: 'close' })),
  })
  const state = createProcessState()
  await expect(
    HandleContextMenu.handleContextMenu(state, 0, 10, 20),
  ).resolves.toBe(state)
})

test('handleContextMenu - default arguments', async () => {
  const openContextMenu = jest.fn(() => ({ type: 'close' }))
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': openContextMenu,
  })
  const state = createProcessState({
    focusedIndex: 1,
  })
  await expect(HandleContextMenu.handleContextMenu(state)).resolves.toBe(state)
  expect(openContextMenu).toHaveBeenCalledWith(
    expect.any(Array),
    0,
    0,
    expect.objectContaining({
      pid: 2,
    }),
  )
})

test('handleContextMenu - kill', async () => {
  const kill = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({
      data: 'Kill Process',
      type: 'select',
    })),
    'Process.kill': kill,
  })
  const state = createProcessState()
  await HandleContextMenu.handleContextMenu(state, 0, 10, 20)
  expect(kill).toHaveBeenCalledWith(1, 'SIGTERM')
})

test('handleContextMenu - debug', async () => {
  const attachDebugger = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({
      data: 'Debug Process',
      type: 'select',
    })),
  })
  const state = createProcessState()
  await HandleContextMenu.handleContextMenu(state, 1, 10, 20)
  expect(attachDebugger).toHaveBeenCalledWith(2)
})

test('handleContextMenu - invalid index', async () => {
  const state = createProcessState()
  await expect(
    HandleContextMenu.handleContextMenu(state, 99, 10, 20),
  ).resolves.toBe(state)
})

test('handleContextMenu - select without data', async () => {
  const kill = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({
      type: 'select',
    })),
    'Process.kill': kill,
  })
  const state = createProcessState()
  await expect(
    HandleContextMenu.handleContextMenu(state, 0, 10, 20),
  ).resolves.toBe(state)
  expect(kill).not.toHaveBeenCalled()
})

test('handleContextMenu - unknown selection', async () => {
  const kill = jest.fn()
  const attachDebugger = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({
      data: 'Unknown',
      type: 'select',
    })),
    'Process.kill': kill,
  })
  const state = createProcessState()
  await expect(
    HandleContextMenu.handleContextMenu(state, 0, 10, 20),
  ).resolves.toBe(state)
  expect(attachDebugger).not.toHaveBeenCalled()
  expect(kill).not.toHaveBeenCalled()
})

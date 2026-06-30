import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'

const processes = [
  {
    cmd: 'main',
    memory: 1,
    name: 'main',
    pid: 1,
    ppid: 0,
  },
  {
    cmd: 'node child.js',
    memory: 1500,
    name: 'child',
    pid: 2,
    ppid: 1,
  },
  {
    cmd: 'leaf',
    memory: 2_500_000,
    name: 'leaf',
    pid: 3,
    ppid: 2,
  },
  {
    cmd: 'orphan',
    memory: 1,
    name: 'orphan',
    pid: 4,
    ppid: 999,
  },
]

test('handleContextMenu - close', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ElectronContextMenu.openContextMenu': jest.fn(() => ({ type: 'close' })),
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(
    HandleContextMenu.handleContextMenu(state, 0, 10, 20),
  ).resolves.toBe(state)
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
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
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
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await HandleContextMenu.handleContextMenu(state, 1, 10, 20)
  expect(attachDebugger).toHaveBeenCalledWith(2)
})

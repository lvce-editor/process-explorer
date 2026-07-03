import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
<<<<<<< HEAD
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'
=======
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'

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
>>>>>>> origin/main

test('handleContextMenu', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': () => undefined,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = await HandleContextMenu.handleContextMenu(state, 0, 10, 20)
  expect(result).toEqual({
    ...state,
    focused: false,
    focusedIndex: 0,
  })
  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      state.uid,
      MenuEntryId.ProcessExplorer,
      10,
      20,
      {
        index: 0,
        menuId: MenuEntryId.ProcessExplorer,
      },
    ],
  ])
})

test('handleContextMenu - invalid index', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': () => undefined,
  })
  const state = createProcessState()
  await expect(
    HandleContextMenu.handleContextMenu(state, 99, 10, 20),
  ).resolves.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

<<<<<<< HEAD
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
=======
test('handleContextMenu - defaults', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': () => undefined,
  })
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = await HandleContextMenu.handleContextMenu(state)
>>>>>>> origin/main

  expect(result).toEqual({
    ...state,
    focused: false,
    focusedIndex: 1,
  })
<<<<<<< HEAD
  const state = createProcessState()
  await HandleContextMenu.handleContextMenu(state, 1, 10, 20)
  expect(attachDebugger).toHaveBeenCalledWith(2)
=======
  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      state.uid,
      MenuEntryId.ProcessExplorer,
      0,
      0,
      {
        index: 1,
        menuId: MenuEntryId.ProcessExplorer,
      },
    ],
  ])
>>>>>>> origin/main
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

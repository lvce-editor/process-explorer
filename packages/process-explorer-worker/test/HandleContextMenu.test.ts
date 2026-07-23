import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
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
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(
    HandleContextMenu.handleContextMenu(state, 99, 10, 20),
  ).resolves.toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('handleContextMenu - string index', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': () => undefined,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = await HandleContextMenu.handleContextMenu(state, '1', 10, 20)
  expect(result).toEqual({
    ...state,
    focused: false,
    focusedIndex: 1,
  })
  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      state.uid,
      MenuEntryId.ProcessExplorer,
      10,
      20,
      {
        index: 1,
        menuId: MenuEntryId.ProcessExplorer,
      },
    ],
  ])
})

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

  expect(result).toEqual({
    ...state,
    focused: false,
    focusedIndex: 1,
  })
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
})

import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as HandleContextMenu from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.ts'
import { processes } from './fixtures/ProcessExplorerFixtures.ts'

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

import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ProcessExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleContextMenuAtIndex } from '../src/parts/HandleContextMenuAtIndex/HandleContextMenuAtIndex.ts'

test('handleContextMenuAtIndex - clears selection when target is not selected', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        depth: 1,
        name: 'a.txt',
        path: '/a.txt',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'b.txt',
        path: '/b.txt',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'c.txt',
        path: '/c.txt',
        selected: false,
        type: DirentType.File,
      },
    ],
  }

  const result = await handleContextMenuAtIndex(state, 2, 100, 200)

  expect(result.items.map((item) => item.selected)).toEqual([
    false,
    false,
    false,
  ])
  expect(result.focusedIndex).toBe(2)
  expect(mockRpc.invocations).toEqual([
    ['ContextMenu.show2', 1, 4, 100, 200, { menuId: 4 }],
  ])
})

test('handleContextMenuAtIndex - keeps selection when target is selected', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        depth: 1,
        name: 'a.txt',
        path: '/a.txt',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'b.txt',
        path: '/b.txt',
        selected: true,
        type: DirentType.File,
      },
      {
        depth: 1,
        name: 'c.txt',
        path: '/c.txt',
        selected: false,
        type: DirentType.File,
      },
    ],
  }

  const result = await handleContextMenuAtIndex(state, 1, 100, 200)

  expect(result.items.map((item) => item.selected)).toEqual([true, true, false])
  expect(result.focusedIndex).toBe(1)
  expect(mockRpc.invocations).toEqual([
    ['ContextMenu.show2', 1, 4, 100, 200, { menuId: 4 }],
  ])
})

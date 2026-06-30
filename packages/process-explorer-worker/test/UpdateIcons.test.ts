import { expect, test } from '@jest/globals'
import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as UpdateIcons from '../src/parts/UpdateIcons/UpdateIcons.ts'

test('updateIcons - should update icons for visible items', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getFolderIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getIcons'() {
      return ['icon1', 'icon2']
    },
  })
  const defaultState: ExplorerState = CreateDefaultState.createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    items: [
      { depth: 1, name: 'file1.ts', path: '/test/file1.ts', selected: false, type: 1 },
      { depth: 1, name: 'file2.ts', path: '/test/file2.ts', selected: false, type: 1 },
      { depth: 1, name: 'file3.ts', path: '/test/file3.ts', selected: false, type: 1 },
    ],
    maxLineY: 2,
    minLineY: 0,
  }

  const result = await UpdateIcons.updateIcons(state)

  expect(result.icons).toHaveLength(2)
  expect(result.fileIconCache).toBeDefined()
  expect(result.items).toEqual(state.items)
  expect(result.minLineY).toBe(state.minLineY)
  expect(result.maxLineY).toBe(state.maxLineY)
  expect(mockRpc.invocations).toEqual([
    [
      'IconTheme.getIcons',
      [
        { name: 'file1.ts', type: 1 },
        { name: 'file2.ts', type: 1 },
      ],
    ],
  ])
})

test('updateIcons - should handle empty visible items', async () => {
  using mockRpc = IconThemeWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getFolderIcon'() {
      return ['icon1', 'icon2']
    },
    'IconTheme.getIcons'() {
      return ['icon1', 'icon2']
    },
  })
  const defaultState: ExplorerState = CreateDefaultState.createDefaultState()
  const state: ExplorerState = {
    ...defaultState,
    items: [],
    maxLineY: 0,
    minLineY: 0,
  }

  const result = await UpdateIcons.updateIcons(state)

  expect(result.icons).toHaveLength(0)
  expect(result.fileIconCache).toBeDefined()
  expect(result.items).toEqual(state.items)
  expect(mockRpc.invocations).toEqual([])
})

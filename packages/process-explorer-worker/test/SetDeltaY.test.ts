import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../src/parts/ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { setDeltaY } from '../src/parts/SetDeltaY/SetDeltaY.ts'

test('should not change state when deltaY is the same', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'icon'
    },
    'IconTheme.getFolderIcon'() {
      return 'icon'
    },
    'IconTheme.getIcons'() {
      return ['icon']
    },
  })
  const state: ExplorerState = createDefaultState()
  const result = await setDeltaY(state, 0)
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([])
})

test('should clamp deltaY to 0 when negative', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'icon'
    },
    'IconTheme.getFolderIcon'() {
      return 'icon'
    },
    'IconTheme.getIcons'() {
      return ['icon']
    },
  })
  const state: ExplorerState = createDefaultState()
  const result = await setDeltaY(state, -50)
  expect(result.deltaY).toBe(0)
  expect(result.minLineY).toBe(0)
  expect(mockRpc.invocations).toEqual([])
})

test('should clamp deltaY to max scroll value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'icon'
    },
    'IconTheme.getFolderIcon'() {
      return 'icon'
    },
    'IconTheme.getIcons'() {
      return ['icon']
    },
  })
  const items: ExplorerItem[] = Array.from({ length: 20 }, (_, i) => ({
    depth: 0,
    name: `file${i}`,
    path: `/file${i}`,
    selected: false,
    type: 1,
  }))
  const state: ExplorerState = {
    ...createDefaultState(),
    items,
  }
  const result = await setDeltaY(state, 500)
  expect(result.deltaY).toBe(300)
  expect(result.minLineY).toBe(15)
  expect(mockRpc.invocations).toEqual([])
})

test('should update visible items and icons', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'IconTheme.getFileIcon'() {
      return 'icon'
    },
    'IconTheme.getFolderIcon'() {
      return 'icon'
    },
    'IconTheme.getIcons'() {
      return ['icon']
    },
  })
  const items: ExplorerItem[] = Array.from({ length: 20 }, (_, i) => ({
    depth: 0,
    name: `file${i}`,
    path: `/file${i}`,
    selected: false,
    type: 1,
  }))
  const state: ExplorerState = {
    ...createDefaultState(),
    items,
  }
  const result = await setDeltaY(state, 100)
  expect(result.deltaY).toBe(100)
  expect(result.minLineY).toBe(5)
  expect(result.maxLineY).toBe(10)
  expect(mockRpc.invocations).toEqual([])
})

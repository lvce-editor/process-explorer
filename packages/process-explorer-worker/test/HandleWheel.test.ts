import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleWheel } from '../src/parts/HandleWheel/HandleWheel.ts'

test('handleWheel calls SetDeltaY with correct delta', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 10,
    height: 50,
    itemHeight: 20,
    items: [
      { depth: 0, name: 'test1', path: '/test1', selected: false, type: 1 },
      { depth: 0, name: 'test2', path: '/test2', selected: false, type: 1 },
      { depth: 0, name: 'test3', path: '/test3', selected: false, type: 1 },
      { depth: 0, name: 'test4', path: '/test4', selected: false, type: 1 },
      { depth: 0, name: 'test5', path: '/test5', selected: false, type: 1 },
    ],
  }
  const result = await handleWheel(state, 0, 5)
  expect(result.deltaY).toBe(15)
  expect(mockRpc.invocations).toEqual([])
})

test('handleWheel with negative delta', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
    'IconTheme.getIcons'() {
      return []
    },
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    deltaY: 10,
    height: 50,
    itemHeight: 20,
    items: [
      { depth: 0, name: 'test1', path: '/test1', selected: false, type: 1 },
      { depth: 0, name: 'test2', path: '/test2', selected: false, type: 1 },
      { depth: 0, name: 'test3', path: '/test3', selected: false, type: 1 },
      { depth: 0, name: 'test4', path: '/test4', selected: false, type: 1 },
      { depth: 0, name: 'test5', path: '/test5', selected: false, type: 1 },
    ],
  }
  const result = await handleWheel(state, 0, -3)
  expect(result.deltaY).toBe(7)
  expect(mockRpc.invocations).toEqual([])
})

import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ProcessExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { revealItem } from '../src/parts/RevealItem/RevealItem.ts'

test('revealItem - item not found', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = createDefaultState()
  const newState = await revealItem(state, 'test')
  expect(newState.items).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})

test('revealItem - uri outside root', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    root: '/root',
  }
  const newState = await revealItem(state, 'non-existent:///some-file.txt')
  expect(newState).toEqual(state)
  expect(mockRpc.invocations).toEqual([])
})

test('revealItem - item found', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    items: [
      {
        depth: 0,
        name: 'test',
        path: 'test',
        selected: false,
        type: 1,
      },
    ],
  }
  const newState = await revealItem(state, 'test')
  expect(newState.items[0].path).toBe('test')
  expect(mockRpc.invocations).toEqual([])
})

test('revealItem - reveals hidden item inside root', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'(uri: string) {
      if (uri === '/workspace') {
        return [{ name: 'src', type: DirentType.Directory }]
      }
      if (uri === '/workspace/src') {
        return [{ name: 'index.ts', type: DirentType.File }]
      }
      throw new Error(`unexpected read ${uri}`)
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    maxLineY: 5,
    root: '/workspace',
  }
  const newState = await revealItem(state, '/workspace/src/index.ts')
  expect(newState.focusedIndex).toBe(1)
  expect(newState.items).toEqual([
    {
      depth: 1,
      icon: '',
      name: 'src',
      path: '/workspace/src',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.DirectoryExpanded,
    },
    {
      depth: 2,
      icon: '',
      name: 'index.ts',
      path: '/workspace/src/index.ts',
      posInSet: 1,
      selected: false,
      setSize: 1,
      type: DirentType.File,
    },
  ])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.readDirWithFileTypes', '/workspace'],
    ['FileSystem.readDirWithFileTypes', '/workspace/src'],
  ])
})

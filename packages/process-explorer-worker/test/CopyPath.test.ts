import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { copyPath } from '../src/parts/CopyPath/CopyPath.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'

test('copyPath - writes absolute path of focused dirent to clipboard', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'(text: string) {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', path: '/test/file.txt', selected: false, type: DirentType.File }],
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', '/test/file.txt']])
})

test('copyPath - writes workspace path when no focused dirent', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'(text: string) {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [],
    root: 'memfs:///workspace',
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'memfs:///workspace']])
})

test('copyPath - writes workspace path when focused index is out of bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ClipBoard.writeText'(text: string) {
      return
    },
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
    items: [{ depth: 0, name: 'file.txt', path: 'memfs:///workspace/file.txt', selected: false, type: DirentType.File }],
    root: 'memfs:///workspace',
  }

  const result = await copyPath(state)

  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['ClipBoard.writeText', 'memfs:///workspace']])
})

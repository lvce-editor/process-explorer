import { expect, jest, test } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { handleCopy } from '../src/parts/HandleCopy/HandleCopy.ts'

test('handleCopy - with focused dirent', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const state: ExplorerState = {
    ...createDefaultState(),
    cutItems: ['/test.txt'],
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', path: '/test.txt', selected: false, type: DirentType.File }],
    pasteShouldMove: true,
  }
  const result = await handleCopy(state)

  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['ClipBoard.writeNativeFiles', 'copy', ['/test.txt']]]))
  expect(result).toEqual({
    ...state,
    cutItems: [],
    pasteShouldMove: false,
  })
})

test('handleCopy - without focused dirent', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
    'ClipBoard.writeNativeFiles'() {},
  })
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: -1,
    items: [],
  }
  const result = await handleCopy(state)
  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith('[ViewletExplorer/handleCopy] no dirent selected')
  spy.mockRestore()
})

import { expect, test } from '@jest/globals'
import { RendererWorker as RpcRendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { openContainingFolder } from '../src/parts/OpenContainingFolder/OpenContainingFolder.ts'

test('openContainingFolder', async () => {
  using mockRpc = RpcRendererWorker.registerMockRpc({
    'OpenNativeFolder.openNativeFolder'() {},
  })
  const mockState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'test.txt', path: '/test.txt', selected: false, type: 1 }],
  }
  const result = await openContainingFolder(mockState)
  expect(mockRpc.invocations).toEqual(expect.arrayContaining([['OpenNativeFolder.openNativeFolder', '']]))
  expect(result).toBe(mockState)
})

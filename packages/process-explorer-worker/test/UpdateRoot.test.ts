import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { updateRoot } from '../src/parts/UpdateRoot/UpdateRoot.ts'

test('updateRoot should return same disposed state', async () => {
  const state = createDefaultState()
  // @ disposed is used in source but not typed
  // @ts-ignore
  state.disposed = true
  const result = await updateRoot(state)
  expect(result).toBe(state)
})

test('updateRoot should merge dirents correctly', async () => {
  const state = createDefaultState()

  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes'() {
      return [
        { name: 'file1', type: 'file' },
        { name: 'dir1', type: 'directory' },
      ]
    },
  })

  const result = await updateRoot(state)
  expect(result.items).toHaveLength(2)
  expect(result.items[0].name).toBe('dir1')
  expect(result.items[1].name).toBe('file1')
  expect(mockRpc.invocations).toEqual([['FileSystem.readDirWithFileTypes', '/']])
})

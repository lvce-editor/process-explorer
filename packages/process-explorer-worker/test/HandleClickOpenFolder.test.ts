import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickOpenFolder } from '../src/parts/HandleClickOpenFolder/HandleClickOpenFolder.ts'

test('handleClickOpenFolder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Dialog.openFolder'() {
      return
    },
  })

  const state = createDefaultState()
  const newState = await handleClickOpenFolder(state)
  expect(newState).toBe(state)
  expect(mockRpc.invocations).toEqual([['Dialog.openFolder']])
})

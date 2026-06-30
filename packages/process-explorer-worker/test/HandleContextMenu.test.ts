import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleContextMenu } from '../src/parts/HandleContextMenu/HandleContextMenu.ts'
import { Keyboard } from '../src/parts/MouseEventType/MouseEventType.ts'

test('handleContextMenu - keyboard', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {
      return
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = createDefaultState()
  const newState = await handleContextMenu(state, Keyboard, 0, 0)
  expect(newState).toBeDefined()
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 0, 20, { menuId: 4 }]])
})

test('handleContextMenu - mouse', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {
      return
    },
    'FileSystem.readDirWithFileTypes'() {
      return []
    },
  })

  const state = createDefaultState()
  const newState = await handleContextMenu(state, 2, 100, 100)
  expect(newState).toBeDefined()
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 100, 100, { menuId: 4 }]])
})

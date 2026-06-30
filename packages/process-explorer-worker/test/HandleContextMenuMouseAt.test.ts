import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuMouseAt from '../src/parts/HandleContextMenuMouseAt/HandleContextMenuMouseAt.ts'

test('handleContextMenuMouseAt', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    itemHeight: 20,
    minLineY: 0,
    uid: 1,
    x: 0,
    y: 0,
  }
  const result = await HandleContextMenuMouseAt.handleContextMenuMouseAt(state, 100, 200)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 100, 200, { menuId: 4 }]])
  expect(result).toEqual({ ...state, focused: false, focusedIndex: -1 })
})

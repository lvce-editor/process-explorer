import { test, expect } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuKeyboard from '../src/parts/HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'

test('handleContextMenuKeyboard', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2'() {},
  })

  const state: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
    itemHeight: 20,
    minLineY: 0,
    x: 100,
    y: 200,
  }
  const result = await HandleContextMenuKeyboard.handleContextMenuKeyboard(state)
  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 1, 4, 100, 260, { menuId: 4 }]])
  expect(result).toEqual({
    ...state,
    focused: false,
  })
})

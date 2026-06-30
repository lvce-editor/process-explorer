import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleEscape } from '../src/parts/HandleEscape/HandleEscape.ts'

test('handleEscape - clears cutItems and keeps other state', async () => {
  const initialState: ExplorerState = {
    ...createDefaultState(),
    cutItems: ['/a/b.txt', '/c/d.txt'],
    focusedIndex: 1,
  }

  const result = await handleEscape(initialState)

  expect(result.cutItems).toEqual([])
  expect(result.focusedIndex).toBe(1)
})

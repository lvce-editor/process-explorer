import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { cancelTypeAhead } from '../src/parts/CancelTypeAhead/CancelTypeAhead.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('cancelTypeAhead - clears focusWord only', () => {
  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 2,
    focusWord: 'abc',
  }

  const result = cancelTypeAhead(initialState)

  expect(result.focusWord).toBe('')
  expect(result.focusedIndex).toBe(2)
})

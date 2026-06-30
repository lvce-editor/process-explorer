import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { revealItemVisible } from '../src/parts/RevealItemVisible/RevealItemVisible.ts'

test('revealItemVisible - updates state with new scroll position and focus', () => {
  const state = createDefaultState()
  const result = revealItemVisible(state, 2)
  expect(result).toEqual({
    ...state,
    focused: true,
    focusedIndex: 2,
    maxLineY: 2,
    minLineY: 2,
  })
})

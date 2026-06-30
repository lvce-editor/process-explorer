import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { handleFocus } from '../src/parts/HandleFocus/HandleFocus.ts'

test('handleFocus keeps input focus while editing', async () => {
  const state = {
    ...createDefaultState(),
    editingIndex: 1,
    focus: FocusId.Input,
  }

  const result = await handleFocus(state)

  expect(result).toBe(state)
})

test('handleFocus switches to list focus when not editing', async () => {
  const state = createDefaultState()

  const result = await handleFocus(state)

  expect(result).toEqual({
    ...state,
    focus: FocusId.List,
  })
})

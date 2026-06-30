import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffSelection/DiffSelection.ts'

test('isEqual - same selection', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingSelectionEnd: 5,
    editingSelectionStart: 0,
  }
  const result = isEqual(state, state)
  expect(result).toBe(true)
})

test('isEqual - different selection', () => {
  const oldState: ExplorerState = {
    ...createDefaultState(),
    editingSelectionEnd: 5,
    editingSelectionStart: 0,
  }
  const newState: ExplorerState = {
    ...createDefaultState(),
    editingSelectionEnd: 6,
    editingSelectionStart: 1,
  }
  const result = isEqual(oldState, newState)
  expect(result).toBe(false)
})

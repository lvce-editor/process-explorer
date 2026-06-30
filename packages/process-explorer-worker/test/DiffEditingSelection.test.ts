import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { diffEditingSelection } from '../src/parts/DiffEditingSelection/DiffEditingSelection.ts'

test('diffEditingSelection - returns undefined when selection is the same', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingSelectionEnd: 5,
    editingSelectionStart: 0,
  }
  const result = diffEditingSelection(state, 0, 5)
  expect(result).toBeUndefined()
})

test('diffEditingSelection - returns new selection when different', () => {
  const state: ExplorerState = {
    ...createDefaultState(),
    editingSelectionEnd: 5,
    editingSelectionStart: 0,
  }
  const result = diffEditingSelection(state, 1, 6)
  expect(result).toEqual({ end: 6, start: 1 })
})

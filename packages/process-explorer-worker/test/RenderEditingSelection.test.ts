import { expect, test } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import { renderEditingSelection } from '../src/parts/RenderEditingSelection/RenderEditingSelection.ts'

test('renderEditingSelection', () => {
  const oldState: ExplorerState = createDefaultState()
  const newState: ExplorerState = {
    ...createDefaultState(),
    editingSelectionEnd: 6,
    editingSelectionStart: 1,
  }
  const result = renderEditingSelection(oldState, newState)
  expect(result).toEqual(['Viewlet.setSelectionByName', newState.uid, InputName.ExplorerInput, 1, 6])
})

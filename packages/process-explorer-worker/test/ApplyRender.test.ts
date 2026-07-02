import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'

test('applyRender - filters empty render commands', () => {
  const state = createDefaultState()

  expect(ApplyRender.applyRender(state, state, [DiffType.RenderFocus])).toEqual(
    [],
  )
})

test('applyRender - returns render commands', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    focused: true,
    focusedIndex: 0,
  }

  expect(
    ApplyRender.applyRender(oldState, newState, [DiffType.RenderFocus]),
  ).toEqual([[ViewletCommand.FocusSelector, '[data-index="0"]']])
})

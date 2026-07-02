import { expect, test } from '@jest/globals'
import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderFocusContext from '../src/parts/RenderFocusContext/RenderFocusContext.ts'

test('renderFocusContext - unchanged', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
  }

  expect(RenderFocusContext.renderFocusContext(oldState, newState)).toEqual([])
})

test('renderFocusContext - focused', () => {
  const oldState = {
    ...createDefaultState(),
    focused: false,
  }
  const newState = {
    ...oldState,
    focused: true,
    uid: 9,
  }

  expect(RenderFocusContext.renderFocusContext(oldState, newState)).toEqual([
    ViewletCommand.SetFocusContext,
    9,
    WhenExpression.FocusExplorer,
  ])
})

test('renderFocusContext - blurred', () => {
  const oldState = {
    ...createDefaultState(),
    focused: true,
  }
  const newState = {
    ...oldState,
    focused: false,
    uid: 9,
  }

  expect(RenderFocusContext.renderFocusContext(oldState, newState)).toEqual([
    ViewletCommand.SetFocusContext,
    9,
    WhenExpression.Empty,
  ])
})

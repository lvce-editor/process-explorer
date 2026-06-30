import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import { renderFocusContext } from '../src/parts/RenderFocusContext/RenderFocusContext.ts'
import * as WhenExpression from '../src/parts/WhenExpression/WhenExpression.ts'

test('should return FocusExplorerEditBox when focus is Input', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: FocusId.Input }

  const result = renderFocusContext(oldState, newState)

  expect(result).toEqual(['Viewlet.setFocusContext', newState.uid, WhenExpression.FocusExplorerEditBox])
})

test('should return FocusExplorer when focus is List', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: FocusId.List }

  const result = renderFocusContext(oldState, newState)

  expect(result).toEqual(['Viewlet.setFocusContext', newState.uid, WhenExpression.FocusExplorer])
})

test('should return empty array when focus is None', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: FocusId.None }

  const result = renderFocusContext(oldState, newState)

  expect(result).toEqual([])
})

test('should return empty array for unknown focus value', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: 999 }

  const result = renderFocusContext(oldState, newState)

  expect(result).toEqual([])
})

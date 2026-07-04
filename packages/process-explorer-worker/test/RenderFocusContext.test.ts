import { expect, test } from '@jest/globals'
import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
import * as RenderFocusContext from '../src/parts/RenderFocusContext/RenderFocusContext.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('renderFocusContext returns no commands when focus is unchanged', () => {
  const state = createProcessState({
    focused: true,
  })
  expect(RenderFocusContext.renderFocusContext(state, state)).toEqual([])
})

test('renderFocusContext sets explorer focus context', () => {
  const oldState = createProcessState({
    focused: false,
    uid: 7,
  })
  const newState = createProcessState({
    focused: true,
    uid: 7,
  })
  expect(RenderFocusContext.renderFocusContext(oldState, newState)).toEqual([
    ViewletCommand.SetFocusContext,
    7,
    WhenExpression.FocusExplorer,
  ])
})

test('renderFocusContext clears explorer focus context', () => {
  const oldState = createProcessState({
    focused: true,
    uid: 7,
  })
  const newState = createProcessState({
    focused: false,
    uid: 7,
  })
  expect(RenderFocusContext.renderFocusContext(oldState, newState)).toEqual([
    ViewletCommand.SetFocusContext,
    7,
    WhenExpression.Empty,
  ])
})

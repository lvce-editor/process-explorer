import { expect, test } from '@jest/globals'
import { ViewletCommand, WhenExpression } from '@lvce-editor/constants'
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
    WhenExpression.FocusExplorer,
  ])
})

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/main
    WhenExpression.Empty,
  ])
})

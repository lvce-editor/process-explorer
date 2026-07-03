import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
<<<<<<< HEAD
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('renderFocus returns no commands when not focused', () => {
  const oldState = createProcessState({
    focusedIndex: 0,
  })
  const newState = createProcessState({
    focused: false,
    focusedIndex: 1,
  })
  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([])
})

test('renderFocus returns no commands when focused index is unchanged', () => {
  const state = createProcessState({
    focused: true,
    focusedIndex: 0,
  })
  expect(RenderFocus.renderFocus(state, state)).toEqual([])
})

test('renderFocus focuses table for negative index', () => {
  const oldState = createProcessState({
    focusedIndex: 1,
  })
  const newState = createProcessState({
    focusedIndex: -1,
  })
=======
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as RenderFocus from '../src/parts/RenderFocus/RenderFocus.ts'

test('renderFocus - not focused', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    focused: false,
    focusedIndex: 0,
  }

  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([])
})

test('renderFocus - focused index unchanged', () => {
  const oldState = {
    ...createDefaultState(),
    focusedIndex: 1,
  }
  const newState = {
    ...oldState,
    focused: true,
  }

  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([])
})

test('renderFocus - focus table', () => {
  const oldState = {
    ...createDefaultState(),
    focusedIndex: 0,
  }
  const newState = {
    ...oldState,
    focused: true,
    focusedIndex: -1,
  }

>>>>>>> origin/main
  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([
    ViewletCommand.FocusSelector,
    '.ProcessExplorerTable',
  ])
})

<<<<<<< HEAD
test('renderFocus focuses row selector for valid index', () => {
  const oldState = createProcessState({
    focusedIndex: 0,
  })
  const newState = createProcessState({
    focusedIndex: 2,
  })
=======
test('renderFocus - focus row', () => {
  const oldState = {
    ...createDefaultState(),
    focusedIndex: -1,
  }
  const newState = {
    ...oldState,
    focused: true,
    focusedIndex: 2,
  }

>>>>>>> origin/main
  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([
    ViewletCommand.FocusSelector,
    '[data-index="2"]',
  ])
})

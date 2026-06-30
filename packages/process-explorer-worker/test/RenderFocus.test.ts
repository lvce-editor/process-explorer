import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
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
  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([
    ViewletCommand.FocusSelector,
    '.ProcessExplorerTable',
  ])
})

test('renderFocus focuses row selector for valid index', () => {
  const oldState = createProcessState({
    focusedIndex: 0,
  })
  const newState = createProcessState({
    focusedIndex: 2,
  })
  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([
    ViewletCommand.FocusSelector,
    '[data-index="2"]',
  ])
})

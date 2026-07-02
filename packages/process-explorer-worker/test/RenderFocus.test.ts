import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
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

  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([
    ViewletCommand.FocusSelector,
    '.ProcessExplorerTable',
  ])
})

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

  expect(RenderFocus.renderFocus(oldState, newState)).toEqual([
    ViewletCommand.FocusSelector,
    '[data-index="2"]',
  ])
})

import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { renderFocus } from '../src/parts/RenderFocus/RenderFocus.ts'

test('empty array when input source is user', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    inputSource: InputSource.User,
  }
  const result = renderFocus(oldState, newState)
  expect(result).toEqual([])
})

test('focus input when focus is input', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    focus: FocusId.Input,
  }
  const result = renderFocus(oldState, newState)
  expect(result).toEqual(['Viewlet.focusElementByName', InputName.ExplorerInput])
})

test('focus list when focus is list', () => {
  const oldState = createDefaultState()
  const newState = {
    ...createDefaultState(),
    focus: FocusId.List,
  }
  const result = renderFocus(oldState, newState)
  expect(result).toEqual(['Viewlet.focusSelector', '.ListItems'])
})

test('empty array when no focus state', () => {
  const oldState = createDefaultState()
  const newState = createDefaultState()
  const result = renderFocus(oldState, newState)
  expect(result).toEqual([])
})

import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import { renderValue } from '../src/parts/RenderValue/RenderValue.ts'

test('should return empty array when inputSource is User', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, inputSource: InputSource.User }

  const result = renderValue(oldState, newState)

  expect(result).toEqual([])
})

test('should return setValue command when focus is Input', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, editingValue: 'test-value', focus: FocusId.Input }

  const result = renderValue(oldState, newState)

  expect(result).toEqual(['Viewlet.setValueByName', InputName.ExplorerInput, 'test-value'])
})

test('should return empty array when focus is not Input', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: FocusId.List }

  const result = renderValue(oldState, newState)

  expect(result).toEqual([])
})

test('should return empty array when focus is None', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: FocusId.None }

  const result = renderValue(oldState, newState)

  expect(result).toEqual([])
})

test('should return empty array when inputSource is Script and focus is not Input', () => {
  const oldState = createDefaultState()
  const newState = { ...oldState, focus: FocusId.List, inputSource: InputSource.Script }

  const result = renderValue(oldState, newState)

  expect(result).toEqual([])
})

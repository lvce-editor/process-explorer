import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffFocus/DiffFocus.ts'

test('isEqual should return true when focused and focus are equal', () => {
  const oldState = {
    ...createDefaultState(),
    focus: 1,
    focused: true,
  }
  const newState = {
    ...createDefaultState(),
    focus: 1,
    focused: true,
  }
  expect(isEqual(oldState, newState)).toBe(true)
})

test('isEqual should return false when focused differs', () => {
  const oldState = {
    ...createDefaultState(),
    focus: 1,
    focused: true,
  }
  const newState = {
    ...createDefaultState(),
    focus: 1,
    focused: false,
  }
  expect(isEqual(oldState, newState)).toBe(false)
})

test('isEqual should return false when focus differs', () => {
  const oldState = {
    ...createDefaultState(),
    focus: 1,
    focused: true,
  }
  const newState = {
    ...createDefaultState(),
    focus: 2,
    focused: true,
  }
  expect(isEqual(oldState, newState)).toBe(false)
})

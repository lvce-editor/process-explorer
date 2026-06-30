import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { isEqual } from '../src/parts/DiffValue/DiffValue.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'

test('isEqual - same focus and editing value', () => {
  const state1 = { ...createDefaultState(), editingValue: 'test', focus: FocusId.Input }
  const state2 = { ...createDefaultState(), editingValue: 'test', focus: FocusId.Input }

  expect(isEqual(state1, state2)).toBe(true)
})

test('isEqual - different focus', () => {
  const state1 = { ...createDefaultState(), editingValue: 'test', focus: FocusId.Input }
  const state2 = { ...createDefaultState(), editingValue: 'test', focus: FocusId.List }
  expect(isEqual(state1, state2)).toBe(true)
})

test('isEqual - different editing value', () => {
  const state1 = { ...createDefaultState(), editingValue: 'test1', focus: FocusId.Input }
  const state2 = { ...createDefaultState(), editingValue: 'test2', focus: FocusId.Input }

  expect(isEqual(state1, state2)).toBe(false)
})

test('isEqual - new focus is list', () => {
  const state1 = { ...createDefaultState(), editingValue: 'test', focus: FocusId.Input }
  const state2 = { ...createDefaultState(), editingValue: 'test', focus: FocusId.List }

  expect(isEqual(state1, state2)).toBe(true)
})

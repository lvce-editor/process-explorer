import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.js'
import { focus } from '../src/parts/Focus/Focus.js'

test('focus - assigns focus if not present', () => {
  const state = { ...createDefaultState(), focus: undefined as unknown as number }
  const result = focus(state)
  expect(result.focus).toBeDefined()
  expect(result).not.toBe(state)
})

test('focus - does not change state if focus present', () => {
  const state = { ...createDefaultState(), focus: 123 }
  const result = focus(state)
  expect(result).toBe(state)
})

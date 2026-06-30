import { test, expect } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleDragLeave } from '../src/parts/HandleDragLeave/HandleDragLeave.ts'

test('handleDragLeave returns state unchanged', () => {
  const state = createDefaultState()
  const result = handleDragLeave(state)
  expect(result).toBe(state)
})

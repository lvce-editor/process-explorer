import { test, expect } from '@jest/globals'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleInputBlur } from '../src/parts/HandleInputBlur/HandleInputBlur.ts'

test('should cancel edit if there is an error message', async () => {
  const state: ExplorerState = { ...createDefaultState(), editingErrorMessage: 'error', editingValue: 'foo' }
  const result = await handleInputBlur(state)
  expect(result.editingValue).toBe('foo')
})

test('should cancel edit if editing value is empty', async () => {
  const state: ExplorerState = { ...createDefaultState(), editingErrorMessage: '', editingValue: '' }
  const result = await handleInputBlur(state)
  expect(result.editingValue).toBe('')
})

test('should accept edit if no error and value present', async () => {
  const state: ExplorerState = { ...createDefaultState(), editingErrorMessage: '', editingType: 0, editingValue: 'foo' }
  const result = await handleInputBlur(state)
  expect(result.editingValue).toBe('foo')
})

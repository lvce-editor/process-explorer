import { expect, test } from '@jest/globals'
import * as HandleClickAt from '../src/parts/HandleClickAt/HandleClickAt.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('handleClickAt focuses clicked index', () => {
  const state = createProcessState()
  expect(HandleClickAt.handleClickAt(state, 1).focusedIndex).toBe(1)
})

test('handleClickAt ignores invalid clicked index', () => {
  const state = createProcessState()
  expect(HandleClickAt.handleClickAt(state, 10)).toBe(state)
})

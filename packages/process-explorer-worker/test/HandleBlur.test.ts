import { expect, test } from '@jest/globals'
import * as HandleBlur from '../src/parts/HandleBlur/HandleBlur.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('handleBlur clears focused state', () => {
  const state = createProcessState({
    focused: true,
  })
  expect(HandleBlur.handleBlur(state)).toMatchObject({
    focused: false,
  })
})

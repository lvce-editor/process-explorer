import { expect, test } from '@jest/globals'
import * as HandleFocus from '../src/parts/HandleFocus/HandleFocus.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('handleFocus sets focused state', () => {
  const state = createProcessState({
    focused: false,
  })
  expect(HandleFocus.handleFocus(state)).toMatchObject({
    focused: true,
  })
})

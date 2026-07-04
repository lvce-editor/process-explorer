import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetRootProcessId from '../src/parts/SetRootProcessId/SetRootProcessId.ts'

test('setRootProcessId', () => {
  const state = createDefaultState()
  const result = SetRootProcessId.setRootProcessId(state, 123)

  expect(result).toEqual({
    ...state,
    rootPid: 123,
  })
})

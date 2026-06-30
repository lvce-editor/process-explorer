import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

test('diff2 unchanged', () => {
  ProcessExplorerStates.clear()
  const state = createDefaultState()
  ProcessExplorerStates.set(1, state, state)
  expect(Diff2.diff2(1)).toEqual([])
})

import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

test('diff2 unchanged', () => {
  ProcessExplorerStates.clear()
  const state = createDefaultState()
  ProcessExplorerStates.set(1, state, state)
  expect(Diff2.diff2(1)).toEqual([])
})

test('diff2 focused index change renders incremental items and focus', () => {
  ProcessExplorerStates.clear()
  const oldState = {
    ...createDefaultState(),
    focused: true,
    focusedIndex: 0,
  }
  const newState = {
    ...oldState,
    focusedIndex: 1,
  }
  ProcessExplorerStates.set(1, oldState, newState)
  expect(Diff2.diff2(1)).toEqual([
    DiffType.RenderIncremental,
    DiffType.RenderFocus,
    DiffType.RenderFocusContext,
  ])
})

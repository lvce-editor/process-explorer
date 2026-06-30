import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

test('createDefaultState', () => {
  expect(createDefaultState()).toMatchObject({
    assetDir: '',
    collapsedPids: [],
    errorCodeFrame: '',
    errorMessage: '',
    errorStack: '',
    focusedIndex: -1,
    processes: [],
    rootPid: 0,
    visibleProcesses: [],
  })
})

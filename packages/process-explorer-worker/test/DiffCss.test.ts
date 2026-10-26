import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffCss from '../src/parts/DiffCss/DiffCss.ts'

test('DiffCss - ignores process updates when unique indents are unchanged', () => {
  const oldState = {
    ...createDefaultState(),
    uniqueIndents: [1, 2],
  }
  const newState = {
    ...oldState,
    processes: [{ cmd: 'updated', memory: 2, name: 'updated', pid: 1, ppid: 0 }],
    uniqueIndents: oldState.uniqueIndents,
    visibleProcesses: [],
  }

  expect(DiffCss.isEqual(oldState, newState)).toBe(true)
})

test('DiffCss - detects a changed unique indent set', () => {
  const oldState = {
    ...createDefaultState(),
    uniqueIndents: [1, 2],
  }
  const newState = {
    ...oldState,
    uniqueIndents: [1, 2, 3],
  }

  expect(DiffCss.isEqual(oldState, newState)).toBe(false)
})

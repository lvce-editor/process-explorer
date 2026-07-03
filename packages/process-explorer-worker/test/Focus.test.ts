import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as FocusFirst from '../src/parts/FocusFirst/FocusFirst.ts'
import * as FocusIndex from '../src/parts/FocusIndex/FocusIndex.ts'
import * as FocusLast from '../src/parts/FocusLast/FocusLast.ts'
import * as FocusPrevious from '../src/parts/FocusPrevious/FocusPrevious.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'

const processes = [
  {
    cmd: 'main',
    memory: 1,
    name: 'main',
    pid: 1,
    ppid: 0,
  },
  {
    cmd: 'node child.js',
    memory: 1500,
    name: 'child',
    pid: 2,
    ppid: 1,
  },
]

const createState = (): ReturnType<typeof createDefaultState> => ({
  ...createDefaultState(),
  visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
})

test('focusFirst - empty list', () => {
  const state = createDefaultState()

  expect(FocusFirst.focusFirst(state)).toBe(state)
})

test('focusFirst', () => {
  const state = createState()

  expect(FocusFirst.focusFirst(state).focusedIndex).toBe(0)
})

test('focusLast - empty list', () => {
  const state = createDefaultState()

  expect(FocusLast.focusLast(state)).toBe(state)
})

test('focusLast', () => {
  const state = createState()

  expect(FocusLast.focusLast(state).focusedIndex).toBe(1)
})

test('focusIndex - below minimum', () => {
  const state = createState()

  expect(FocusIndex.focusIndex(state, -2)).toBe(state)
})

test('focusIndex - above maximum', () => {
  const state = createState()

  expect(FocusIndex.focusIndex(state, 2)).toBe(state)
})

test('focusIndex - valid empty focus', () => {
  const state = createState()

  expect(FocusIndex.focusIndex(state, -1).focusedIndex).toBe(-1)
})

test('focusPrevious - wraps from empty focus', () => {
  const state = {
    ...createState(),
    focusedIndex: -1,
  }

  expect(FocusPrevious.focusPrevious(state).focusedIndex).toBe(1)
})

test('focusPrevious - stays on empty list', () => {
  const state = createDefaultState()

  expect(FocusPrevious.focusPrevious(state)).toBe(state)
})

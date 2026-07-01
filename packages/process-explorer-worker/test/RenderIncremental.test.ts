import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import { renderIncremental } from '../src/parts/RenderIncremental/RenderIncremental.ts'

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

test('renderIncremental - returns patches for changed processes', () => {
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    uid: 123,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = renderIncremental(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetPatches)
  expect(result[1]).toBe(123)
  expect(result[2]).toEqual(expect.any(Array))
})

test('renderIncremental - returns patches for focused row change', () => {
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    processes,
    [],
    1,
  )
  const oldState = {
    ...createDefaultState(),
    focusedIndex: 0,
    initial: false,
    visibleProcesses,
  }
  const newState = {
    ...oldState,
    focusedIndex: 1,
    uid: 123,
  }
  const result = renderIncremental(oldState, newState)
  expect(result[0]).toBe(ViewletCommand.SetPatches)
  expect(result[1]).toBe(123)
  expect(JSON.stringify(result[2])).toContain(
    'ProcessExplorerRow ProcessExplorerRowFocused',
  )
})

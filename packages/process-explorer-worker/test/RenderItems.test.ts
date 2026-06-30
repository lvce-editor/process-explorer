import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as RenderItems from '../src/parts/RenderItems/RenderItems.ts'

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
  {
    cmd: 'leaf',
    memory: 2_500_000,
    name: 'leaf',
    pid: 3,
    ppid: 2,
  },
  {
    cmd: 'orphan',
    memory: 1,
    name: 'orphan',
    pid: 4,
    ppid: 999,
  },
]

test('renderItems - populated table', () => {
  const state = {
    ...createDefaultState(),
    focusedIndex: 1,
    initial: false,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  const result = RenderItems.renderItems(createDefaultState(), state)
  expect(result[0]).toBe(ViewletCommand.SetDom2)
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaLabel: 'Process Explorer',
      className: 'ProcessExplorerTable',
      role: 'grid',
    }),
  )
  expect(result[2]).toContainEqual(
    expect.objectContaining({
      ariaExpanded: true,
      ariaLevel: 2,
      className: 'ProcessExplorerRow ProcessExplorerRowFocused',
      name: '1',
      title: 'node child.js',
    }),
  )
})

test('renderItems - initial is empty', () => {
  const state = {
    ...createDefaultState(),
    initial: true,
  }
  expect(RenderItems.renderItems(createDefaultState(), state)).toEqual([
    ViewletCommand.SetDom2,
    1,
    [],
  ])
})

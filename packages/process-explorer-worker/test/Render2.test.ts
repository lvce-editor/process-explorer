import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetUniqueIndents from '../src/parts/GetUniqueIndents/GetUniqueIndents.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'

const processes = [
  {
    cmd: 'main',
    memory: 1,
    name: 'main',
    parentTreeId: 0,
    pid: 1,
    ppid: 0,
    source: 'local' as const,
    synthetic: false,
    treeId: 1,
  },
  {
    cmd: 'node child.js',
    memory: 1500,
    name: 'child',
    parentTreeId: 1,
    pid: 2,
    ppid: 1,
    source: 'local' as const,
    synthetic: false,
    treeId: 2,
  },
  {
    cmd: 'leaf',
    memory: 2_500_000,
    name: 'leaf',
    parentTreeId: 2,
    pid: 3,
    ppid: 2,
    source: 'local' as const,
    synthetic: false,
    treeId: 3,
  },
  {
    cmd: 'orphan',
    memory: 1,
    name: 'orphan',
    parentTreeId: 999,
    pid: 4,
    ppid: 999,
    source: 'local' as const,
    synthetic: false,
    treeId: 4,
  },
]

test('render2', async () => {
  ProcessExplorerStates.clear()
  const uid = 1
  const oldState = createDefaultState()
  const visibleProcesses = GetVisibleProcesses.getVisibleProcesses(
    processes,
    [],
    1,
  )
  const newState = {
    ...oldState,
    uniqueIndents: GetUniqueIndents.getUniqueIndents(
      visibleProcesses,
      oldState.uniqueIndents,
    ),
    visibleProcesses,
  }
  ProcessExplorerStates.set(uid, oldState, newState)
  expect(Diff2.diff2(uid)).toEqual([
    DiffType.RenderIncremental,
    DiffType.RenderCss,
  ])
  const commands = await Render2.render2(uid, [
    DiffType.RenderIncremental,
    DiffType.RenderCss,
  ])
  expect(commands[0][0]).toBe(ViewletCommand.SetPatches)
  expect(commands[1][0]).toBe(ViewletCommand.SetCss)
  expect(ProcessExplorerStates.get(uid).oldState).toBe(newState)
})

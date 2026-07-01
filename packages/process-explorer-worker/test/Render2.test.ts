import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'

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

test('render2', () => {
  ProcessExplorerStates.clear()
  const uid = 1
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  ProcessExplorerStates.set(uid, oldState, newState)
  expect(Diff2.diff2(uid)).toEqual([DiffType.RenderIncremental])
  const commands = Render2.render2(uid, [DiffType.RenderIncremental])
  expect(commands[0][0]).toBe(ViewletCommand.SetPatches)
  expect(ProcessExplorerStates.get(uid).oldState).toBe(newState)
})

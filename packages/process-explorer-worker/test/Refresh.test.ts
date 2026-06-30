import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Refresh from '../src/parts/Refresh/Refresh.ts'

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

test('refresh - success', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => processes,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result).toMatchObject({
    errorMessage: '',
    focusedIndex: 0,
    initial: false,
    rootPid: 1,
  })
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('refresh - error', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw new Error('no pid')
    }),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result.errorMessage).toBe('no pid')
  expect(result.initial).toBe(false)
})

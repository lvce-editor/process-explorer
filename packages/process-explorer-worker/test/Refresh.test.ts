import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Refresh from '../src/parts/Refresh/Refresh.ts'
import { processes } from './fixtures/ProcessExplorerFixtures.ts'

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

test('refresh - existing root pid', async () => {
  const getMainProcessId = jest.fn(() => {
    throw new Error('should not be called')
  })
  const listProcesses = jest.fn(() => processes)
  using _mockRpc = RendererWorker.registerMockRpc({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': listProcesses,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    rootPid: 1,
  })
  expect(getMainProcessId).not.toHaveBeenCalled()
  expect(listProcesses).toHaveBeenCalledWith(1)
  expect(result.rootPid).toBe(1)
  expect(result.focusedIndex).toBe(0)
})

test('refresh - clamps focused index', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => processes,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    focusedIndex: 99,
  })
  expect(result.focusedIndex).toBe(2)
})

test('refresh - empty visible processes', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => [],
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    focusedIndex: 2,
  })
  expect(result.focusedIndex).toBe(-1)
  expect(result.visibleProcesses).toEqual([])
})

test('refresh - non error thrown value', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw 'no pid'
    }),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result.errorMessage).toBe('no pid')
})

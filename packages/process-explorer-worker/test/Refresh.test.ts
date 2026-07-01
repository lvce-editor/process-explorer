import { expect, jest, test } from '@jest/globals'
import type { Rpc } from '@lvce-editor/rpc'
import { createMockRpc } from '@lvce-editor/rpc'
import { ErrorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as InitializeProcessExplorer from '../src/parts/InitializeProcessExplorer/InitializeProcessExplorer.ts'
import * as ProcessExplorerModule from '../src/parts/ProcessExplorer/ProcessExplorer.ts'
import * as Refresh from '../src/parts/Refresh/Refresh.ts'

interface DisposableMockRpc {
  [Symbol.dispose](): void
}

const registerErrorWorkerMock = (
  commandMap: Record<string, unknown>,
): DisposableMockRpc => {
  ErrorWorker.set(createMockRpc({ commandMap }))
  return {
    [Symbol.dispose](): void {
      ErrorWorker.set(createMockRpc({ commandMap: {} }))
    },
  }
}

const registerProcessExplorerMock = (
  commandMap: Record<string, unknown>,
): DisposableMockRpc => {
  InitializeProcessExplorer.clear()
  ProcessExplorerModule.set(createMockRpc({ commandMap }) as unknown as Rpc)
  return {
    [Symbol.dispose](): void {
      InitializeProcessExplorer.clear()
      ProcessExplorerModule.clear()
    },
  }
}

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
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => processes,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result).toMatchObject({
    errorCodeFrame: '',
    errorMessage: '',
    errorStack: '',
    focusedIndex: 0,
    initial: false,
    rootPid: 1,
  })
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3,
  ])
})

test('refresh - error', async () => {
  const prepare = jest.fn((_error: unknown) => ({
    codeFrame: '1 | throw new Error()',
    message: 'Pretty no pid',
    stack: 'Pretty stack',
  }))
  using _mockRpc = registerProcessExplorerMock({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw new Error('no pid')
    }),
  })
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': prepare,
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(prepare).toHaveBeenCalledTimes(1)
  expect(prepare.mock.calls[0][0]).toBeInstanceOf(Error)
  expect(result.errorCodeFrame).toBe('1 | throw new Error()')
  expect(result.errorMessage).toBe('Pretty no pid')
  expect(result.errorStack).toBe('Pretty stack')
  expect(result.initial).toBe(false)
})

test('refresh - error prepare fails', async () => {
  using _mockRpc = registerProcessExplorerMock({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw new Error('no pid')
    }),
  })
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': jest.fn(() => {
      throw new Error('prepare failed')
    }),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result.errorCodeFrame).toBe('')
  expect(result.errorMessage).toBe('no pid')
  expect(result.errorStack).toBe('')
  expect(result.initial).toBe(false)
})

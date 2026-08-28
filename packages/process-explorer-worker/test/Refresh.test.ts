import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { createMockRpc } from '@lvce-editor/rpc'
import { ErrorWorker, MainProcess } from '@lvce-editor/rpc-registry'

const initializeProcessExplorer = jest.fn(
  async (..._args: readonly unknown[]) => {},
)

jest.unstable_mockModule(
  '../src/parts/InitializeProcessExplorer/InitializeProcessExplorer.ts',
  () => ({
    clear: jest.fn(),
    initializeProcessExplorer,
  }),
)

const { createDefaultState } =
  await import('../src/parts/CreateDefaultState/CreateDefaultState.ts')
const ProcessExplorerModule =
  await import('../src/parts/ProcessExplorer/ProcessExplorer.ts')
const RemoteProcessExplorer =
  await import('../src/parts/RemoteProcessExplorer/RemoteProcessExplorer.ts')
const Refresh = await import('../src/parts/Refresh/Refresh.ts')

interface DisposableMockRpc {
  [Symbol.dispose](): void
}

const originalPerformance = globalThis.performance

const setPerformance = (performance: unknown): void => {
  Object.defineProperty(globalThis, 'performance', {
    configurable: true,
    value: performance,
  })
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
  ProcessExplorerModule.set(createMockRpc({ commandMap }))
  return {
    [Symbol.dispose](): void {
      ProcessExplorerModule.clear()
    },
  }
}

const registerMainProcessMock = (
  commandMap: Record<string, unknown>,
): DisposableMockRpc => {
  MainProcess.set(createMockRpc({ commandMap }))
  return {
    [Symbol.dispose](): void {
      MainProcess.set(createMockRpc({ commandMap: {} }))
    },
  }
}

const registerRemoteProcessExplorerMock = (
  commandMap: Record<string, unknown>,
): DisposableMockRpc => {
  RemoteProcessExplorer.set(createMockRpc({ commandMap }))
  return {
    [Symbol.dispose](): void {
      RemoteProcessExplorer.clear()
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

beforeEach(() => {
  initializeProcessExplorer.mockClear()
})

afterEach(() => {
  setPerformance(originalPerformance)
})

test('refresh - success - remote', async () => {
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => processes,
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 1)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    platform: PlatformType.Remote,
  })
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
  expect(initializeProcessExplorer).toHaveBeenCalledWith(PlatformType.Remote)
  expect(getMainProcessId).toHaveBeenCalledWith({ includeElectronData: false })
  expect(listProcessesWithMemoryUsage).toHaveBeenCalledWith(1, false)
})

test('refresh - success - electron', async () => {
  const pidMap = {
    2: 'shared-process',
  }
  const createPidMap = jest.fn(() => pidMap)
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => processes,
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 1)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  using _mockMainProcessRpc = registerMainProcessMock({
    'CreatePidMap.createPidMap': createPidMap,
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    platform: PlatformType.Electron,
  })

  expect(result.rootPid).toBe(1)
  expect(initializeProcessExplorer).toHaveBeenCalledWith(PlatformType.Electron)
  expect(getMainProcessId).toHaveBeenCalledWith({ includeElectronData: true })
  expect(createPidMap).toHaveBeenCalledTimes(1)
  expect(listProcessesWithMemoryUsage).toHaveBeenCalledWith(1, false, pidMap)
})

test('refresh - electron with remote workspace', async () => {
  const localProcesses = [processes[0], processes[1]]
  const remoteProcesses = [
    { cmd: 'remote main', memory: 3, name: 'remote-main', pid: 1, ppid: 0 },
    { cmd: 'remote child', memory: 4, name: 'remote-child', pid: 2, ppid: 1 },
  ]
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => localProcesses,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  using _mockRemoteRpc = registerRemoteProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => remoteProcesses,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  using _mockMainProcessRpc = registerMainProcessMock({
    'CreatePidMap.createPidMap': jest.fn(() => ({})),
  })

  const result = await Refresh.refresh({
    ...createDefaultState(),
    platform: PlatformType.Electron,
  })

  expect(
    result.visibleProcesses.map(({ depth, name, source }) => ({
      depth,
      name,
      source,
    })),
  ).toEqual([
    { depth: 1, name: 'Local', source: 'local' },
    { depth: 2, name: 'main', source: 'local' },
    { depth: 3, name: 'child', source: 'local' },
    { depth: 1, name: 'Remote', source: 'remote' },
    { depth: 2, name: 'remote-main', source: 'remote' },
    { depth: 3, name: 'remote-child', source: 'remote' },
  ])
})

test('refresh - groups conceptual processes below shared process on electron', async () => {
  const electronProcesses = [
    processes[0],
    {
      cmd: 'shared',
      memory: 1,
      name: 'shared-process',
      pid: 10,
      ppid: 1,
    },
    {
      cmd: 'terminal',
      memory: 1,
      name: 'terminal-process',
      pid: 11,
      ppid: 1,
    },
    {
      cmd: 'bash',
      memory: 1,
      name: 'bash',
      pid: 12,
      ppid: 11,
    },
  ]
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => electronProcesses,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  using _mockMainProcessRpc = registerMainProcessMock({
    'CreatePidMap.createPidMap': jest.fn(() => ({})),
  })

  const result = await Refresh.refresh({
    ...createDefaultState(),
    platform: PlatformType.Electron,
  })

  expect(result.processes.find((process) => process.pid === 11)?.ppid).toBe(10)
  expect(
    result.visibleProcesses.map(({ depth, pid }) => ({ depth, pid })),
  ).toEqual([
    { depth: 1, pid: 1 },
    { depth: 2, pid: 10 },
    { depth: 3, pid: 11 },
    { depth: 4, pid: 12 },
  ])
})

test('refresh - uses existing root pid', async () => {
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => processes,
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 99)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    rootPid: 1,
  })

  expect(result.rootPid).toBe(1)
  expect(getMainProcessId).not.toHaveBeenCalled()
  expect(listProcessesWithMemoryUsage).toHaveBeenCalledWith(1, false)
})

test('refresh - reuses root pid after first refresh', async () => {
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => processes,
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 1)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const firstResult = await Refresh.refresh(createDefaultState())
  const secondResult = await Refresh.refresh(firstResult)

  expect(secondResult.rootPid).toBe(1)
  expect(getMainProcessId).toHaveBeenCalledTimes(1)
  expect(listProcessesWithMemoryUsage).toHaveBeenCalledTimes(2)
  expect(listProcessesWithMemoryUsage).toHaveBeenNthCalledWith(1, 1, false)
  expect(listProcessesWithMemoryUsage).toHaveBeenNthCalledWith(2, 1, false)
})

test('refresh - includes frontend memory usage', async () => {
  setPerformance({
    measureUserAgentSpecificMemory: jest.fn(async () => ({
      breakdown: [
        {
          attribution: [
            {
              scope: 'script',
              url: 'https://example.com/app.js',
            },
          ],
          bytes: 20,
        },
      ],
      bytes: 100,
    })),
  })
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => processes,
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 1)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    includeFrontendMemoryUsage: true,
  })

  expect(result.processes.map((process) => process.pid)).toEqual([
    1, 2, 3, 4, -1, -2,
  ])
  expect(result.visibleProcesses.map((process) => process.pid)).toEqual([
    1, 2, 3, -1, -2,
  ])
})

test('refresh - no visible processes', async () => {
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => [],
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 1)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const result = await Refresh.refresh(createDefaultState())

  expect(result.focusedIndex).toBe(-1)
  expect(result.visibleProcesses).toEqual([])
})

test('refresh - clamps focused index', async () => {
  const listProcessesWithMemoryUsage = jest.fn(
    (..._args: readonly unknown[]) => processes,
  )
  const getMainProcessId = jest.fn((..._args: readonly unknown[]) => 1)
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
      listProcessesWithMemoryUsage,
    'ProcessId.getMainProcessId': getMainProcessId,
  })
  const result = await Refresh.refresh({
    ...createDefaultState(),
    focusedIndex: 99,
  })

  expect(result.focusedIndex).toBe(2)
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
  expect(result.errorCode).toBe('E_PROCESS_EXPLORER_REFRESH_FAILED')
  expect(result.errorCodeFrame).toBe('1 | throw new Error()')
  expect(result.errorMessage).toBe('Pretty no pid')
  expect(result.errorStack).toBe('Pretty stack')
  expect(result.initial).toBe(false)
})

test('refresh - preserves error code', async () => {
  using _mockRpc = registerProcessExplorerMock({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw Object.assign(new Error('no pid'), { code: 'ERR_NO_PID' })
    }),
  })
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': jest.fn(() => ({
      codeFrame: undefined,
      message: 'Pretty no pid',
      stack: undefined,
    })),
  })

  const result = await Refresh.refresh(createDefaultState())

  expect(result.errorCode).toBe('ERR_NO_PID')
  expect(result.errorMessage).toBe('Pretty no pid')
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
  expect(result.errorCode).toBe('E_PROCESS_EXPLORER_REFRESH_FAILED')
  expect(result.errorCodeFrame).toBe('')
  expect(result.errorMessage).toBe('no pid')
  expect(result.errorStack).toBe('')
  expect(result.initial).toBe(false)
})

test('refresh - non error prepare fails', async () => {
  using _mockRpc = registerProcessExplorerMock({
    'ProcessId.getMainProcessId': jest.fn(() => {
      throw 'no pid'
    }),
  })
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': jest.fn(() => {
      throw new Error('prepare failed')
    }),
  })
  const result = await Refresh.refresh(createDefaultState())
  expect(result.errorCode).toBe('E_PROCESS_EXPLORER_REFRESH_FAILED')
  expect(result.errorCodeFrame).toBe('')
  expect(result.errorMessage).toBe('no pid')
  expect(result.errorStack).toBe('')
  expect(result.initial).toBe(false)
})

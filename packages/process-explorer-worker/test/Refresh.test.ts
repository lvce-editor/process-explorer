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

beforeEach(() => {
  initializeProcessExplorer.mockClear()
})

afterEach(() => {
  setPerformance(originalPerformance)
})

test('refresh - web is unsupported', async () => {
  const state = {
    ...createDefaultState(),
    initial: true,
    platform: PlatformType.Web,
  }

  const result = await Refresh.refresh(state)

  expect(result).toEqual({
    ...state,
    initial: false,
    message: 'Process Explorer is not supported on web.',
  })
  expect(initializeProcessExplorer).not.toHaveBeenCalled()
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

  expect(result.processes.find((process) => process.pid === 2)?.name).toBe(
    'shared-process',
  )
  expect(result.rootPid).toBe(1)
  expect(initializeProcessExplorer).toHaveBeenCalledWith(PlatformType.Electron)
  expect(getMainProcessId).toHaveBeenCalledWith({ includeElectronData: true })
  expect(createPidMap).toHaveBeenCalledTimes(1)
  expect(listProcessesWithMemoryUsage).toHaveBeenCalledWith(1, false, pidMap)
})

test('refresh - electron with remote workspace', async () => {
  const localProcesses = [
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
      cmd: 'node sharedProcessMain.js',
      memory: 2,
      name: 'shared-process',
      parentTreeId: 1,
      pid: 2,
      ppid: 1,
      source: 'local' as const,
      synthetic: false,
      treeId: 2,
    },
    {
      cmd: 'remote ssh extension',
      memory: 3,
      name: 'extension-builtin.remote-ssh:remote-SSH',
      parentTreeId: 1,
      pid: 3,
      ppid: 1,
      source: 'local' as const,
      synthetic: false,
      treeId: 3,
    },
    {
      cmd: 'ssh',
      memory: 4,
      name: 'ssh',
      parentTreeId: 3,
      pid: 4,
      ppid: 3,
      source: 'local' as const,
      synthetic: false,
      treeId: 4,
    },
    {
      cmd: 'other extension',
      memory: 5,
      name: 'extension-builtin.other:other',
      parentTreeId: 1,
      pid: 5,
      ppid: 1,
      source: 'local' as const,
      synthetic: false,
      treeId: 5,
    },
  ]
  const remoteProcesses = [
    {
      cmd: 'remote main',
      memory: 3,
      name: 'remote-main',
      parentTreeId: 0,
      pid: 1,
      ppid: 0,
      source: 'local' as const,
      synthetic: false,
      treeId: 1,
    },
    {
      cmd: 'remote child',
      memory: 4,
      name: 'remote-child',
      parentTreeId: 1,
      pid: 2,
      ppid: 1,
      source: 'local' as const,
      synthetic: false,
      treeId: 2,
    },
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
    'CreatePidMap.createPidMap': jest.fn(() => ({
      3: 'extension-builtin.remote-ssh:remote-SSH',
      5: 'extension-builtin.other:other',
    })),
  })

  const result = await Refresh.refresh({
    ...createDefaultState(),
    platform: PlatformType.Electron,
  })

  expect(
    result.visibleProcesses.map(({ depth, memory, name, pid, source }) => ({
      depth,
      memory,
      name,
      pid,
      source,
    })),
  ).toEqual([
    { depth: 1, memory: 0, name: 'Local', pid: 0, source: 'local' },
    { depth: 2, memory: 1, name: 'main', pid: 1, source: 'local' },
    { depth: 3, memory: 2, name: 'shared-process', pid: 2, source: 'local' },
    {
      depth: 4,
      memory: 3,
      name: 'extension-builtin.remote-ssh:remote-SSH',
      pid: 3,
      source: 'local',
    },
    { depth: 5, memory: 4, name: 'ssh', pid: 4, source: 'local' },
    {
      depth: 3,
      memory: 5,
      name: 'extension-builtin.other:other',
      pid: 5,
      source: 'local',
    },
    { depth: 1, memory: 0, name: 'Remote', pid: 0, source: 'remote' },
    { depth: 2, memory: 3, name: 'main', pid: 1, source: 'remote' },
    { depth: 3, memory: 4, name: 'remote child', pid: 2, source: 'remote' },
  ])

  const collapsedResult = await Refresh.refresh({
    ...createDefaultState(),
    collapsedPids: ['local:2'],
    platform: PlatformType.Electron,
  })
  expect(
    collapsedResult.visibleProcesses.map((process) => process.name),
  ).toEqual([
    'Local',
    'main',
    'shared-process',
    'extension-builtin.other:other',
    'Remote',
    'main',
    'remote child',
  ])
})

test('refresh - groups conceptual processes below shared process on electron', async () => {
  const electronProcesses = [
    processes[0],
    {
      cmd: 'node sharedProcessMain.js',
      memory: 1,
      name: 'shared-process',
      parentTreeId: 1,
      pid: 10,
      ppid: 1,
      source: 'local' as const,
      synthetic: false,
      treeId: 10,
    },
    {
      cmd: 'electron --type=utility',
      memory: 1,
      name: 'terminal-process',
      parentTreeId: 1,
      pid: 11,
      ppid: 1,
      source: 'local' as const,
      synthetic: false,
      treeId: 11,
    },
    {
      cmd: 'bash',
      memory: 1,
      name: 'bash',
      parentTreeId: 11,
      pid: 12,
      ppid: 11,
      source: 'local' as const,
      synthetic: false,
      treeId: 12,
    },
  ]
  using _mockRpc = registerProcessExplorerMock({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => electronProcesses,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  using _mockMainProcessRpc = registerMainProcessMock({
    'CreatePidMap.createPidMap': jest.fn(() => ({ 11: 'terminal-process' })),
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

// A legacy collector may still send friendly names. Command metadata is the
// source of truth, and the remote root must not inherit local Electron labels.
test.each(['legacy label', 'node /tmp/language-server/zls'])(
  'refresh - names remote records from commands (%s)',
  async (name) => {
    const remoteProcesses = [
      {
        cmd: 'node remote-main.js',
        memory: 123,
        name,
        parentTreeId: 0,
        pid: 50,
        ppid: 0,
        source: 'local' as const,
        synthetic: false,
        treeId: 50,
      },
      {
        cmd: 'node /tmp/language-server/zls',
        memory: 456,
        name,
        parentTreeId: 50,
        pid: 51,
        ppid: 50,
        source: 'local' as const,
        synthetic: false,
        treeId: 51,
      },
    ]
    using _mockRpc = registerProcessExplorerMock({
      'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
        () => remoteProcesses,
      ),
      'ProcessId.getMainProcessId': jest.fn(() => 50),
    })
    const result = await Refresh.refresh({
      ...createDefaultState(),
      platform: PlatformType.Remote,
    })
    expect(result.processes).toEqual([
      { ...remoteProcesses[0], name: 'main' },
      { ...remoteProcesses[1], name: 'Zig Language Server' },
    ])
    expect(remoteProcesses.map((process) => process.name)).toEqual([name, name])
  },
)

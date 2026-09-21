import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { MainProcess, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DebugProcess from '../src/parts/DebugProcess/DebugProcess.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as KillProcess from '../src/parts/KillProcess/KillProcess.ts'
import * as ProcessExplorer from '../src/parts/ProcessExplorer/ProcessExplorer.ts'
import * as RemoteProcessExplorer from '../src/parts/RemoteProcessExplorer/RemoteProcessExplorer.ts'
import * as TakeHeapSnapshot from '../src/parts/TakeHeapSnapshot/TakeHeapSnapshot.ts'

interface DisposableMockRpc {
  [Symbol.dispose](): void
}

const registerProcessExplorerMock = (
  commandMap: Record<string, unknown>,
): DisposableMockRpc => {
  ProcessExplorer.set(createMockRpc({ commandMap }))
  return {
    [Symbol.dispose](): void {
      ProcessExplorer.clear()
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
]

test('killProcess', async () => {
  const kill = jest.fn()
  using _mockRpc = registerProcessExplorerMock({
    'Process.kill': kill,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(KillProcess.killProcess(state, 0)).resolves.toBe(state)
  expect(kill).toHaveBeenCalledWith(1)
})

test('killProcess - missing process', async () => {
  const kill = jest.fn()
  using _mockRpc = registerProcessExplorerMock({
    'Process.kill': kill,
  })
  const state = createDefaultState()
  await expect(KillProcess.killProcess(state, 0)).resolves.toBe(state)
  expect(kill).not.toHaveBeenCalled()
})

test('killProcess - remote process', async () => {
  const kill = jest.fn()
  using _mockRemoteRpc = registerRemoteProcessExplorerMock({
    'Process.kill': kill,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: [
      {
        cmd: 'remote child',
        depth: 2,
        flags: 0,
        memory: 1,
        name: 'remote-child',
        pid: 2,
        ppid: 1,
        source: 'remote' as const,
      },
    ],
  }

  await expect(KillProcess.killProcess(state, 0)).resolves.toBe(state)
  expect(kill).toHaveBeenCalledWith(2)
})

test('killProcess - process group', async () => {
  const state = {
    ...createDefaultState(),
    visibleProcesses: [
      {
        cmd: 'Local',
        depth: 1,
        flags: 1,
        memory: 0,
        name: 'Local',
        pid: 0,
        ppid: 0,
        synthetic: true as const,
      },
    ],
  }

  await expect(KillProcess.killProcess(state, 0)).resolves.toBe(state)
})

test('killProcess - does not wait for process explorer rpc response', async () => {
  const kill = jest.fn((_pid: number) => new Promise(() => {}))
  using _mockRpc = registerProcessExplorerMock({
    'Process.kill': kill,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: [
      {
        cmd: 'processExplorerMain.ts',
        depth: 0,
        flags: 0,
        memory: 1,
        name: 'process-explorer',
        pid: 3,
        ppid: 1,
      },
    ],
  }

  await expect(KillProcess.killProcess(state, 0)).resolves.toMatchObject({
    errorCode: 'E_PROCESS_EXPLORER_RPC_CONNECTION_CLOSED',
    errorCodeFrame: '',
    errorMessage: 'Process explorer RPC connection was closed',
    errorStack: '',
    initial: false,
  })
  expect(kill).toHaveBeenCalledWith(3)
})

test('debugProcess', async () => {
  const debugProcess = jest.fn<
    (pid: number, command: string) => Promise<string>
  >(async () => 'ws://127.0.0.1:9230/target')
  const attachDebugger = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
  })
  using _processExplorerRpc = registerProcessExplorerMock({
    'Process.debugProcess': debugProcess,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(DebugProcess.debugProcess(state, 1)).resolves.toBe(state)
  expect(debugProcess).toHaveBeenCalledWith(2, 'node child.js')
  expect(attachDebugger).toHaveBeenCalledWith('ws://127.0.0.1:9230/target')
})

test('debugProcess - remote process', async () => {
  const debugProcess = jest.fn<
    (pid: number, command: string) => Promise<string>
  >(async () => 'ws://127.0.0.1:9231/target')
  const attachDebugger = jest.fn()
  using _remoteProcessExplorerRpc = registerRemoteProcessExplorerMock({
    'Process.debugProcess': debugProcess,
  })
  using _rendererWorkerRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: [
      {
        cmd: 'node remote.js',
        depth: 2,
        flags: 0,
        memory: 1,
        name: 'remote-child',
        pid: 4,
        ppid: 1,
        source: 'remote' as const,
      },
    ],
  }

  await expect(DebugProcess.debugProcess(state, 0)).resolves.toBe(state)
  expect(debugProcess).toHaveBeenCalledWith(4, 'node remote.js')
  expect(attachDebugger).toHaveBeenCalledWith('ws://127.0.0.1:9231/target')
})

test('debugProcess - missing process', async () => {
  const attachDebugger = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
  })
  const state = createDefaultState()
  await expect(DebugProcess.debugProcess(state, 0)).resolves.toBe(state)
  expect(attachDebugger).not.toHaveBeenCalled()
})

test('takeHeapSnapshot', async () => {
  const takeHeapSnapshot = jest.fn<
    (_pid: number, _command: string) => Promise<string>
  >(async () => 'file:///tmp/snapshot%20with%20space.heapsnapshot')
  const openUri = jest.fn()
  using _processExplorerRpc = registerProcessExplorerMock({
    'Process.takeHeapSnapshot': takeHeapSnapshot,
  })
  using _rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Main.openUri': openUri,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }

  await expect(TakeHeapSnapshot.takeHeapSnapshot(state, 1)).resolves.toBe(state)
  expect(takeHeapSnapshot).toHaveBeenCalledWith(2, 'node child.js')
  expect(openUri).toHaveBeenCalledWith(
    'file:///tmp/snapshot%20with%20space.heapsnapshot',
  )
})

test('takeHeapSnapshot - remote process', async () => {
  const takeHeapSnapshot = jest.fn<
    (_pid: number, _command: string) => Promise<string>
  >(async () => 'file:///remote/tmp/remote.heapsnapshot')
  const openUri = jest.fn()
  using _remoteProcessExplorerRpc = registerRemoteProcessExplorerMock({
    'Process.takeHeapSnapshot': takeHeapSnapshot,
  })
  using _rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Main.openUri': openUri,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: [
      {
        cmd: 'node remote.js',
        depth: 2,
        flags: 0,
        memory: 1,
        name: 'remote-child',
        pid: 4,
        ppid: 1,
        source: 'remote' as const,
      },
    ],
  }

  await expect(TakeHeapSnapshot.takeHeapSnapshot(state, 0)).resolves.toBe(state)
  expect(takeHeapSnapshot).toHaveBeenCalledWith(4, 'node remote.js')
  expect(openUri).toHaveBeenCalledWith('file:///remote/tmp/remote.heapsnapshot')
})

test('takeHeapSnapshot - local renderer process', async () => {
  const takeRendererHeapSnapshot = jest.fn<(pid: number) => Promise<string>>(
    async () => 'file:///tmp/renderer.heapsnapshot',
  )
  const openUri = jest.fn()
  using _mainProcessRpc = MainProcess.registerMockRpc({
    'ElectronDeveloper.takeRendererHeapSnapshot': takeRendererHeapSnapshot,
  })
  using _rendererWorkerRpc = RendererWorker.registerMockRpc({
    'Main.openUri': openUri,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: [
      {
        cmd: 'electron --type=renderer',
        depth: 1,
        flags: 0,
        memory: 1,
        name: 'renderer',
        pid: 5,
        ppid: 1,
      },
    ],
  }

  await expect(TakeHeapSnapshot.takeHeapSnapshot(state, 0)).resolves.toBe(state)
  expect(takeRendererHeapSnapshot).toHaveBeenCalledWith(5)
  expect(openUri).toHaveBeenCalledWith('file:///tmp/renderer.heapsnapshot')
})

test('takeHeapSnapshot - missing process', async () => {
  const state = createDefaultState()
  await expect(TakeHeapSnapshot.takeHeapSnapshot(state, 0)).resolves.toBe(state)
})

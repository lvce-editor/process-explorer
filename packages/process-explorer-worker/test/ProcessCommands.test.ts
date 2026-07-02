import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DebugProcess from '../src/parts/DebugProcess/DebugProcess.ts'
import * as GetVisibleProcesses from '../src/parts/GetVisibleProcesses/GetVisibleProcesses.ts'
import * as KillProcess from '../src/parts/KillProcess/KillProcess.ts'

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
  using _mockRpc = RendererWorker.registerMockRpc({
    'Process.kill': kill,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(KillProcess.killProcess(state, 0)).resolves.toBe(state)
  expect(kill).toHaveBeenCalledWith(1, 'SIGTERM')
})

test('killProcess - missing process', async () => {
  const kill = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'Process.kill': kill,
  })
  const state = createDefaultState()
  await expect(KillProcess.killProcess(state, 0)).resolves.toBe(state)
  expect(kill).not.toHaveBeenCalled()
})

test('debugProcess', async () => {
  const attachDebugger = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'AttachDebugger.attachDebugger': attachDebugger,
  })
  const state = {
    ...createDefaultState(),
    visibleProcesses: GetVisibleProcesses.getVisibleProcesses(processes, [], 1),
  }
  await expect(DebugProcess.debugProcess(state, 1)).resolves.toBe(state)
  expect(attachDebugger).toHaveBeenCalledWith(2)
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

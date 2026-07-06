import type { Rpc } from '@lvce-editor/rpc'
import { beforeEach, expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Dispose from '../src/parts/Dispose/Dispose.ts'
import * as ProcessExplorer from '../src/parts/ProcessExplorer/ProcessExplorer.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

const createRpc = (): Rpc => ({
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
})

const createState = (uid: number): void => {
  const state = {
    ...createDefaultState(),
    uid,
  }
  ProcessExplorerStates.set(uid, state, state)
}

beforeEach(() => {
  ProcessExplorer.clear()
  ProcessExplorerStates.clear()
  jest.clearAllMocks()
})

test('dispose - keeps process explorer rpc when other states remain', async () => {
  createState(1)
  createState(2)
  const rpc = createRpc()
  ProcessExplorer.set(rpc)

  await Dispose.dispose(1)

  expect(ProcessExplorerStates.get(1)).toBeUndefined()
  expect(ProcessExplorerStates.get(2)).toBeDefined()
  expect(rpc.dispose).not.toHaveBeenCalled()
})

test('dispose - disposes process explorer rpc when last state closes', async () => {
  createState(1)
  const rpc = createRpc()
  ProcessExplorer.set(rpc)

  await Dispose.dispose(1)

  expect(ProcessExplorerStates.get(1)).toBeUndefined()
  expect(rpc.dispose).toHaveBeenCalledTimes(1)
})

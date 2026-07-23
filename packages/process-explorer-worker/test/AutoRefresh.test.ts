import { afterEach, expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as AutoRefresh from '../src/parts/AutoRefresh/AutoRefresh.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Dispose from '../src/parts/Dispose/Dispose.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

afterEach(() => {
  AutoRefresh.clear()
  ProcessExplorerStates.clear()
  jest.useRealTimers()
})

const createState = (uid: number): void => {
  const state = {
    ...createDefaultState(),
    uid,
  }
  ProcessExplorerStates.set(uid, state, state)
}

test('auto refresh - invokes process explorer update', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, 100)
  await jest.advanceTimersByTimeAsync(100)

  expect(update).toHaveBeenCalledTimes(1)
})

test('auto refresh - does not create duplicate intervals', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, 100)
  AutoRefresh.start(7, 100)
  await jest.advanceTimersByTimeAsync(100)

  expect(update).toHaveBeenCalledTimes(1)
})

test('auto refresh - skips overlapping updates', async () => {
  jest.useFakeTimers()
  const { promise, resolve } = Promise.withResolvers<void>()
  const update = jest.fn(() => promise)
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, 100)
  await jest.advanceTimersByTimeAsync(100)
  await jest.advanceTimersByTimeAsync(100)
  resolve()
  await Promise.resolve()

  expect(update).toHaveBeenCalledTimes(1)
})

test('auto refresh - clears interval when state is disposed', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, 100)
  ProcessExplorerStates.dispose(7)
  await jest.advanceTimersByTimeAsync(100)
  createState(7)
  await jest.advanceTimersByTimeAsync(100)

  expect(update).not.toHaveBeenCalled()
})

test('auto refresh - dispose clears interval and state', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, 100)
  await Dispose.dispose(7)
  await jest.advanceTimersByTimeAsync(100)

  expect(update).not.toHaveBeenCalled()
  expect(ProcessExplorerStates.get(7)).toBeUndefined()
})

test('auto refresh - zero interval disables updates', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, 0)
  await jest.advanceTimersByTimeAsync(1000)

  expect(update).not.toHaveBeenCalled()
})

test('auto refresh - negative interval disables updates', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  createState(7)

  AutoRefresh.start(7, -1)
  await jest.advanceTimersByTimeAsync(1000)

  expect(update).not.toHaveBeenCalled()
})

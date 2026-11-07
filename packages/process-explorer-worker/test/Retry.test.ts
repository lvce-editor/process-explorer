import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { ErrorWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as AutoRefresh from '../src/parts/AutoRefresh/AutoRefresh.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Dispose from '../src/parts/Dispose/Dispose.ts'
import * as ProcessExplorer from '../src/parts/ProcessExplorer/ProcessExplorer.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'
import * as Retry from '../src/parts/Retry/Retry.ts'

const state = {
  ...createDefaultState(),
  errorCode: 'E_PROCESS_EXPLORER_RPC_CONNECTION_CLOSED',
  errorMessage: 'Process explorer RPC connection was closed',
  rootPid: 123,
  uid: 7,
  updateInterval: 100,
}
const update = jest.fn(() => {})
const list = jest.fn((_rootPid: number, _includeElectronData: boolean) => [
  { cmd: 'node', memory: 1, pid: 456, ppid: 0 },
])
const getRoot = jest.fn(async () => 456)

beforeEach(() => {
  jest.useFakeTimers()
  jest.clearAllMocks()
  ProcessExplorerStates.set(7, state, state)
  ProcessExplorer.set({
    ...createMockRpc({
      commandMap: {
        'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': list,
        'ProcessId.getMainProcessId': getRoot,
      },
    }),
    dispose: async () => {},
  })
  RendererWorker.set(
    createMockRpc({ commandMap: { 'ProcessExplorer.update': update } }),
  )
  ErrorWorker.set(
    createMockRpc({
      commandMap: {
        'Errors.prepare': (error: Error) => ({ message: error.message }),
      },
    }),
  )
})

afterEach(() => {
  AutoRefresh.clear()
  ProcessExplorerStates.clear()
  ProcessExplorer.clear()
  RendererWorker.set(createMockRpc({ commandMap: {} }))
  ErrorWorker.set(createMockRpc({ commandMap: {} }))
  jest.useRealTimers()
})

test('retry clears the error, discovers the restarted process PID and resumes one refresh loop', async () => {
  const [result, duplicate] = await Promise.all([
    Retry.retry(state),
    Retry.retry(state),
  ])
  expect(result).toBe(duplicate)
  expect(result).toMatchObject({
    errorCode: '',
    errorMessage: '',
    rootPid: 456,
  })
  expect(getRoot).toHaveBeenCalledTimes(1)
  expect(list).toHaveBeenCalledWith(456, false)
  await jest.advanceTimersByTimeAsync(300)
  expect(update).toHaveBeenCalledTimes(3)
  await Dispose.dispose(7)
  await jest.advanceTimersByTimeAsync(300)
  expect(update).toHaveBeenCalledTimes(3)
})

test('a failed retry retains a recoverable error and can be retried again', async () => {
  getRoot.mockRejectedValueOnce(new Error('endpoint unavailable'))
  const failed = await Retry.retry(state)
  expect(failed.errorMessage).toContain('endpoint unavailable')
  await jest.advanceTimersByTimeAsync(300)
  expect(update).not.toHaveBeenCalled()
  const recovered = await Retry.retry(failed)
  expect(recovered.errorMessage).toBe('')
  await jest.advanceTimersByTimeAsync(100)
  expect(update).toHaveBeenCalledTimes(1)
})

test('disposing during a retry waits for the connection and leaves no refresh loop or RPC', async () => {
  const { promise, resolve: resolveRoot } = Promise.withResolvers<number>()
  const started = Promise.withResolvers<void>()
  getRoot.mockImplementationOnce(() => {
    started.resolve()
    return promise
  })
  const retry = Retry.retry(state)
  await started.promise
  const dispose = Dispose.dispose(7)
  resolveRoot(456)
  await Promise.all([retry, dispose])
  expect(ProcessExplorerStates.get(7)).toBeUndefined()
  await jest.advanceTimersByTimeAsync(300)
  expect(update).not.toHaveBeenCalled()
  await expect(
    ProcessExplorer.invoke('ProcessId.getMainProcessId'),
  ).rejects.toThrow()
})

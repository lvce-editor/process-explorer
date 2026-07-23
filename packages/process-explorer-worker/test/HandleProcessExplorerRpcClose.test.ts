import { afterEach, expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as AutoRefresh from '../src/parts/AutoRefresh/AutoRefresh.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleProcessExplorerRpcClose from '../src/parts/HandleProcessExplorerRpcClose/HandleProcessExplorerRpcClose.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

afterEach(() => {
  AutoRefresh.clear()
  ProcessExplorerStates.clear()
  jest.useRealTimers()
})

test('handleProcessExplorerRpcClose - displays an error and stops refreshing', async () => {
  jest.useFakeTimers()
  const rerender = jest.fn()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.rerender': rerender,
    'ProcessExplorer.update': update,
  })
  const state = {
    ...createDefaultState(),
    errorCodeFrame: 'old code frame',
    errorStack: 'old stack',
    uid: 7,
  }
  ProcessExplorerStates.set(7, state, state)
  AutoRefresh.start(7, 100)

  await HandleProcessExplorerRpcClose.handleProcessExplorerRpcClose()
  await jest.advanceTimersByTimeAsync(100)

  expect(ProcessExplorerStates.get(7).scheduledState).toMatchObject({
    errorCodeFrame: '',
    errorMessage: HandleProcessExplorerRpcClose.processExplorerRpcClosedMessage,
    errorStack: '',
    initial: false,
  })
  expect(rerender).toHaveBeenCalledTimes(1)
  expect(update).not.toHaveBeenCalled()
})

test('handleProcessExplorerRpcClose - ignores close after disposal', async () => {
  const rerender = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.rerender': rerender,
  })

  await HandleProcessExplorerRpcClose.handleProcessExplorerRpcClose()

  expect(rerender).not.toHaveBeenCalled()
})

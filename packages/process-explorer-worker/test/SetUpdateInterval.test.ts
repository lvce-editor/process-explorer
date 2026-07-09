import { afterEach, expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as AutoRefresh from '../src/parts/AutoRefresh/AutoRefresh.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'
import * as SetUpdateInterval from '../src/parts/SetUpdateInterval/SetUpdateInterval.ts'

afterEach(() => {
  AutoRefresh.clear()
  ProcessExplorerStates.clear()
  jest.useRealTimers()
})

test('setUpdateInterval - disables existing interval', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  ProcessExplorerStates.set(7, state, state)
  AutoRefresh.start(7, 100)

  const result = SetUpdateInterval.setUpdateInterval(state, -1)
  await jest.advanceTimersByTimeAsync(100)

  expect(result.updateInterval).toBe(-1)
  expect(update).not.toHaveBeenCalled()
})

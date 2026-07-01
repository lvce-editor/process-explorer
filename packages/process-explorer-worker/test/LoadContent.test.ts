import { afterEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as AutoRefresh from '../src/parts/AutoRefresh/AutoRefresh.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'
import * as ProcessExplorerModule from '../src/parts/ProcessExplorer/ProcessExplorer.ts'
import * as ProcessExplorerStates from '../src/parts/ProcessExplorerStates/ProcessExplorerStates.ts'

afterEach(() => {
  AutoRefresh.clear()
  ProcessExplorerModule.clear()
  ProcessExplorerStates.clear()
  jest.useRealTimers()
})

test('loadContent - refreshes and starts auto refresh', async () => {
  jest.useFakeTimers()
  const update = jest.fn()
  using _mockRendererRpc = RendererWorker.registerMockRpc({
    'ProcessExplorer.update': update,
  })
  const listProcessesWithMemoryUsage = jest.fn(
    (_rootPid: number, _includeElectronData: boolean) => [
      {
        cmd: 'main',
        memory: 1,
        name: 'main',
        pid: 1,
        ppid: 0,
      },
    ],
  )
  const getMainProcessId = jest.fn(() => 1)
  ProcessExplorerModule.set(
    createMockRpc({
      commandMap: {
        'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage':
          listProcessesWithMemoryUsage,
        'ProcessId.getMainProcessId': getMainProcessId,
      },
    }),
  )
  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  ProcessExplorerStates.set(7, state, state)

  const result = await LoadContent.loadContent(state)
  await jest.advanceTimersByTimeAsync(1000)

  expect(getMainProcessId).toHaveBeenCalledTimes(1)
  expect(listProcessesWithMemoryUsage).toHaveBeenCalledWith(1, false)
  expect(update).toHaveBeenCalledTimes(1)
  expect(result.error).toBeUndefined()
  expect(result.state).toMatchObject({
    initial: false,
    rootPid: 1,
  })
})

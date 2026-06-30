import { expect, jest, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { processes } from './fixtures/ProcessExplorerFixtures.ts'

test('loadContent refreshes process explorer state', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage': jest.fn(
      () => processes,
    ),
    'ProcessId.getMainProcessId': jest.fn(() => 1),
  })
  const result = await LoadContent.loadContent(createDefaultState())
  expect(result.error).toBeUndefined()
  expect(result.state).toMatchObject({
    errorMessage: '',
    focusedIndex: 0,
    initial: false,
    rootPid: 1,
  })
})

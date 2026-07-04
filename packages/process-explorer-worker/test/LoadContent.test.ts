import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'
import { processes } from './fixtures/ProcessExplorerFixtures.ts'

const ProcessExplorerModule =
  await import('../src/parts/ProcessExplorer/ProcessExplorer.ts')

interface DisposableMockRpc {
  [Symbol.dispose](): void
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

test('loadContent refreshes process explorer state', async () => {
  using _mockRpc = registerProcessExplorerMock({
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

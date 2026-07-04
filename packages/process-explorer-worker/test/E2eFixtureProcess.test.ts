import { beforeEach, expect, jest, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'

beforeEach(() => {
  jest.clearAllMocks()
})

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()

jest.unstable_mockModule(
  '../src/parts/ProcessExplorer/ProcessExplorer.ts',
  () => ({
    invoke,
  }),
)

const E2eFixtureProcess =
  await import('../src/parts/E2eFixtureProcess/E2eFixtureProcess.ts')

test('createE2eFixtureProcess', async () => {
  invoke.mockResolvedValue(123)

  const state = createDefaultState()
  await expect(
    E2eFixtureProcess.createE2eFixtureProcess(state, 'test-marker'),
  ).resolves.toEqual({
    ...state,
    rootPid: 123,
  })
  expect(invoke).toHaveBeenCalledWith(
    'Process.createE2eFixtureProcess',
    'test-marker',
  )
})

test('disposeE2eFixtureProcess', async () => {
  invoke.mockResolvedValue(undefined)

  await E2eFixtureProcess.disposeE2eFixtureProcess(7, 'test-marker')
  expect(invoke).toHaveBeenCalledWith(
    'Process.disposeE2eFixtureProcess',
    'test-marker',
  )
})

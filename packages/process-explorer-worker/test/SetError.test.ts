import { expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { ErrorWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetError from '../src/parts/SetError/SetError.ts'

interface DisposableMockRpc {
  [Symbol.dispose](): void
}

const registerErrorWorkerMock = (
  commandMap: Record<string, unknown>,
): DisposableMockRpc => {
  ErrorWorker.set(createMockRpc({ commandMap }))
  return {
    [Symbol.dispose](): void {
      ErrorWorker.set(createMockRpc({ commandMap: {} }))
    },
  }
}

test('setError', async () => {
  const prepare = jest.fn((_error: unknown) => ({
    codeFrame: '1 | throw new Error()',
    message: 'Pretty fixture error',
    stack: 'Pretty stack',
  }))
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': prepare,
  })

  const result = await SetError.setError(createDefaultState(), {
    code: 'ERR_TEST',
    message: 'Fixture error',
    stack: 'Error: Fixture error\n    at fixture (/tmp/fixture.ts:1:1)',
  })

  expect(prepare).toHaveBeenCalledTimes(1)
  expect(prepare.mock.calls[0][0]).toBeInstanceOf(Error)
  expect(prepare.mock.calls[0][0]).toMatchObject({
    code: 'ERR_TEST',
    message: 'Fixture error',
    stack: 'Error: Fixture error\n    at fixture (/tmp/fixture.ts:1:1)',
  })
  expect(result.errorCodeFrame).toBe('1 | throw new Error()')
  expect(result.errorMessage).toBe('Pretty fixture error')
  expect(result.errorStack).toBe('Pretty stack')
  expect(result.initial).toBe(false)
})

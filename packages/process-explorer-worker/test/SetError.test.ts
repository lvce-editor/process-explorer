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
  expect(prepare.mock.calls[0][0]).toEqual({
    code: 'ERR_TEST',
    message: 'Fixture error',
    stack: 'Error: Fixture error\n    at fixture (/tmp/fixture.ts:1:1)',
  })
  expect(result.errorCode).toBe('ERR_TEST')
  expect(result.errorCodeFrame).toBe('1 | throw new Error()')
  expect(result.errorMessage).toBe('Pretty fixture error')
  expect(result.errorStack).toBe('Pretty stack')
  expect(result.initial).toBe(false)
})

test('setError - uses fallback code', async () => {
  using _mockErrorRpc = registerErrorWorkerMock({})

  const result = await SetError.setError(createDefaultState(), 'Fixture error')

  expect(result.errorCode).toBe('E_PROCESS_EXPLORER_ERROR')
  expect(result.errorMessage).toBe('Fixture error')
})

test('setError - converts an error with a code but no stack', async () => {
  const prepare = jest.fn((_error: unknown) => ({
    codeFrame: '',
    message: 'Fixture error without a stack',
    stack: '',
  }))
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': prepare,
  })

  const result = await SetError.setError(createDefaultState(), {
    code: 'ERR_TEST',
    message: 'Fixture error without a stack',
  })

  expect(prepare).toHaveBeenCalledWith(
    expect.objectContaining({
      code: 'ERR_TEST',
      message: 'Fixture error without a stack',
    }),
  )
  expect(result.errorCode).toBe('ERR_TEST')
  expect(result.errorCodeFrame).toBe('')
  expect(result.errorStack).toBe('')
})

test('setError - preserves Error instances', async () => {
  const prepare = jest.fn((_error: unknown) => ({
    codeFrame: '',
    message: 'Original error',
    stack: '',
  }))
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': prepare,
  })
  const error = new Error('Original error')

  await SetError.setError(createDefaultState(), error)

  expect(prepare).toHaveBeenCalledWith(error)
})

test('setError - stringifies raw errors without a message or code', async () => {
  const prepare = jest.fn((_error: unknown) => ({
    codeFrame: '',
    message: 'undefined',
    stack: '',
  }))
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': prepare,
  })

  const result = await SetError.setError(createDefaultState(), {})

  expect(prepare).toHaveBeenCalledWith(expect.any(Error))
  expect(result.errorCode).toBe('E_PROCESS_EXPLORER_ERROR')
  expect(result.errorMessage).toBe('undefined')
})

test('setError - uses the original message when pretty formatting omits it', async () => {
  using _mockErrorRpc = registerErrorWorkerMock({
    'Errors.prepare': () => ({ codeFrame: '', message: '', stack: '' }),
  })

  const result = await SetError.setError(
    createDefaultState(),
    new Error('Original failure'),
  )

  expect(result.errorMessage).toBe('Original failure')
})

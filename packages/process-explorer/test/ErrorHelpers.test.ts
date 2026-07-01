import { expect, test } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.ts'
import * as IsDlOpenError from '../src/parts/IsDlOpenError/IsDlOpenError.ts'
import * as IsEnoentError from '../src/parts/IsEnoentError/IsEnoentError.ts'
import * as IsEnoentErrorWindows from '../src/parts/IsEnoentErrorWindows/IsEnoentErrorWindows.ts'
import * as IsEsrchError from '../src/parts/IsEsrchError/IsEsrchError.ts'

test('isDlOpenError', () => {
  const error = Object.assign(new Error('native module failed'), {
    code: ErrorCodes.ERR_DLOPEN_FAILED,
  })

  expect(IsDlOpenError.isDlOpenError(error)).toBe(true)
  expect(
    IsDlOpenError.isDlOpenError({ code: ErrorCodes.ERR_DLOPEN_FAILED }),
  ).toBe(false)
  expect(IsDlOpenError.isDlOpenError(new Error('other'))).toBe(false)
})

test('isEnoentError', () => {
  expect(IsEnoentError.isEnoentError({ code: ErrorCodes.ENOENT })).toBe(true)
  expect(
    IsEnoentError.isEnoentError({
      message: 'The system cannot find the path specified.',
    }),
  ).toBe(true)
  expect(IsEnoentError.isEnoentError(null)).toBe(false)
  expect(IsEnoentError.isEnoentError({ code: 'Other' })).toBeFalsy()
})

test('isEnoentErrorWindows', () => {
  expect(
    IsEnoentErrorWindows.isEnoentErrorWindows({
      message: 'The system cannot find the path specified.',
    }),
  ).toBe(true)
  expect(IsEnoentErrorWindows.isEnoentErrorWindows({ message: 'Other' })).toBe(
    false,
  )
  expect(IsEnoentErrorWindows.isEnoentErrorWindows(undefined)).toBeFalsy()
})

test('isEsrchError', () => {
  expect(IsEsrchError.isEsrchError({ code: ErrorCodes.ESRCH })).toBe(true)
  expect(IsEsrchError.isEsrchError({ code: ErrorCodes.ENOENT })).toBe(false)
  expect(IsEsrchError.isEsrchError(null)).toBeNull()
})

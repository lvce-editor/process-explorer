import { expect, test } from '@jest/globals'
import * as GetErrorCode from '../src/parts/GetErrorCode/GetErrorCode.ts'

const fallback = 'E_PROCESS_EXPLORER_ERROR'

test('getErrorCode - returns error code', () => {
  expect(GetErrorCode.getErrorCode({ code: 'ERR_TEST' }, fallback)).toBe(
    'ERR_TEST',
  )
})

test('getErrorCode - returns fallback for missing error code', () => {
  expect(GetErrorCode.getErrorCode(new Error('test'), fallback)).toBe(fallback)
})

test('getErrorCode - returns fallback for empty error code', () => {
  expect(GetErrorCode.getErrorCode({ code: '' }, fallback)).toBe(fallback)
})

test('getErrorCode - returns fallback for non-string error code', () => {
  expect(GetErrorCode.getErrorCode({ code: 1 }, fallback)).toBe(fallback)
})

test('getErrorCode - returns fallback for primitive error', () => {
  expect(GetErrorCode.getErrorCode('test', fallback)).toBe(fallback)
})

import { expect, test } from '@jest/globals'
import * as GetErrorCode from '../src/parts/GetErrorCode/GetErrorCode.ts'

test('getErrorCode - returns code from object error', () => {
  const error = {
    code: 'ENOENT',
  }
  expect(GetErrorCode.getErrorCode(error)).toBe('ENOENT')
})

test('getErrorCode - returns empty string for error without string code', () => {
  const error = {
    code: 404,
  }
  expect(GetErrorCode.getErrorCode(error)).toBe('')
})

test('getErrorCode - returns empty string for null', () => {
  expect(GetErrorCode.getErrorCode(null)).toBe('')
})

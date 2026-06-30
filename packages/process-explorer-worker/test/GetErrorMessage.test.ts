import { expect, test } from '@jest/globals'
import * as GetErrorMessage from '../src/parts/GetErrorMessage/GetErrorMessage.ts'

test('getErrorMessage - returns message from Error instance', () => {
  expect(GetErrorMessage.getErrorMessage(new Error('Failed to load'))).toBe('Failed to load')
})

test('getErrorMessage - returns string error as is', () => {
  expect(GetErrorMessage.getErrorMessage('Failed to load')).toBe('Failed to load')
})

test('getErrorMessage - returns fallback for unknown error', () => {
  expect(GetErrorMessage.getErrorMessage({ message: 'Hidden' })).toBe('Unknown error')
})

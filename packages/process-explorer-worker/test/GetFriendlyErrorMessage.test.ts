import { expect, test } from '@jest/globals'
import * as GetFriendlyErrorMessage from '../src/parts/GetFriendlyErrorMessage/GetFriendlyErrorMessage.ts'

test('getFriendlyErrorMessage - maps permission errors', () => {
  expect(GetFriendlyErrorMessage.getFriendlyErrorMessage('Access denied', 'EACCES')).toBe('permission was denied')
  expect(GetFriendlyErrorMessage.getFriendlyErrorMessage('Access denied', 'EPERM')).toBe('permission was denied')
})

test('getFriendlyErrorMessage - maps busy error', () => {
  expect(GetFriendlyErrorMessage.getFriendlyErrorMessage('Busy', 'EBUSY')).toBe('the folder is currently in use')
})

test('getFriendlyErrorMessage - returns explicit message for unknown code', () => {
  expect(GetFriendlyErrorMessage.getFriendlyErrorMessage('Custom failure', 'UNKNOWN')).toBe('Custom failure')
})

test('getFriendlyErrorMessage - returns generic fallback for empty message', () => {
  expect(GetFriendlyErrorMessage.getFriendlyErrorMessage('', 'UNKNOWN')).toBe('an unexpected error occurred')
})

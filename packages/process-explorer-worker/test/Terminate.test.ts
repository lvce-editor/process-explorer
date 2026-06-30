import { expect, jest, test } from '@jest/globals'
import { terminate } from '../src/parts/Terminate/Terminate.ts'

test('terminate', () => {
  const mockClose = jest.fn()
  Object.defineProperty(globalThis, 'close', {
    configurable: true,
    value: mockClose,
  })
  terminate()
  expect(mockClose).toHaveBeenCalled()
})

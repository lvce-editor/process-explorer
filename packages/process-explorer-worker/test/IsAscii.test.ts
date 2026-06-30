import { test, expect } from '@jest/globals'
import { isAscii } from '../src/parts/IsAscii/IsAscii.js'

test('isAscii - lowercase ascii', () => {
  expect(isAscii('a')).toBe(true)
  expect(isAscii('z')).toBe(true)
})

test('isAscii - uppercase ascii', () => {
  expect(isAscii('A')).toBe(false)
  expect(isAscii('Z')).toBe(false)
})

test('isAscii - non-ascii', () => {
  expect(isAscii('ä')).toBe(false)
  expect(isAscii('1')).toBe(false)
  expect(isAscii('-')).toBe(false)
  expect(isAscii(' ')).toBe(false)
  expect(isAscii('')).toBe(false)
})

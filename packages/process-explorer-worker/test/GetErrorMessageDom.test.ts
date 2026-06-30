import { test, expect } from '@jest/globals'
import { getErrorMessageDom } from '../src/parts/GetErrorMessageDom/GetErrorMessageDom.ts'

test('should return empty array for empty error message', () => {
  const result = getErrorMessageDom('')
  expect(result).toEqual([])
})

test('should return dom nodes for non-empty error message', () => {
  const result = getErrorMessageDom('Error!')
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)
})

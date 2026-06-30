import { expect, test } from '@jest/globals'
import * as IsEqual from '../src/parts/IsEqual/IsEqual.ts'

test('isEqual - empty arrays', () => {
  expect(IsEqual.isEqual([], [])).toBe(true)
})

test('isEqual - arrays with same elements', () => {
  expect(IsEqual.isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
})

test('isEqual - arrays with different elements', () => {
  expect(IsEqual.isEqual([1, 2, 3], [1, 2, 4])).toBe(false)
})

test('isEqual - arrays with different lengths', () => {
  expect(IsEqual.isEqual([1, 2], [1, 2, 3])).toBe(false)
})

test('isEqual - arrays with same elements in different order', () => {
  expect(IsEqual.isEqual([1, 2, 3], [3, 2, 1])).toBe(false)
})

test('isEqual - arrays with string elements', () => {
  expect(IsEqual.isEqual(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true)
})

test('isEqual - arrays with mixed elements', () => {
  expect(IsEqual.isEqual([1, 'b', true], [1, 'b', true])).toBe(true)
})

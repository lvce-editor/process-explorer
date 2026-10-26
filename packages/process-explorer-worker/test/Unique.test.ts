import { expect, test } from '@jest/globals'
import { unique } from '../src/parts/Unique/Unique.ts'

test('unique - returns an empty array for empty input', () => {
  expect(unique([])).toEqual([])
})

test('unique - preserves first occurrence order and leaves input unchanged', () => {
  const values = [3, 1, 3, 2, 1]

  expect(unique(values)).toEqual([3, 1, 2])
  expect(values).toEqual([3, 1, 3, 2, 1])
})

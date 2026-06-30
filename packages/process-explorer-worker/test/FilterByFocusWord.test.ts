import { expect, test } from '@jest/globals'
import { filterByFocusWord } from '../src/parts/FilterByFocusWord/FilterByFocusWord.ts'

test('filterByFocusWord - basic match', () => {
  const items = ['apple', 'banana', 'cherry']
  expect(filterByFocusWord(items, -1, 'b')).toBe(1)
})

test('filterByFocusWord - no match', () => {
  const items = ['apple', 'banana', 'cherry']
  expect(filterByFocusWord(items, -1, 'x')).toBe(-1)
})

test('filterByFocusWord - cycle through matches', () => {
  const items = ['apple', 'banana', 'berry']
  // First match
  expect(filterByFocusWord(items, -1, 'b')).toBe(1)
  // Next match after current focus
  expect(filterByFocusWord(items, 1, 'b')).toBe(2)
  // Wrap around to first match
  expect(filterByFocusWord(items, 2, 'b')).toBe(1)
})

test('filterByFocusWord - empty items', () => {
  expect(filterByFocusWord([], -1, 'a')).toBe(-1)
})

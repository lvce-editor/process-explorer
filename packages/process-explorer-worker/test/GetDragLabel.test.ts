import { test, expect } from '@jest/globals'
import { getDragLabel } from '../src/parts/GetDragLabel/GetDragLabel.js'

test('getDragLabel - single url', () => {
  expect(getDragLabel(['file:///a.txt'])).toBe('a.txt')
})

test('getDragLabel - multiple urls', () => {
  expect(getDragLabel(['file:///a.txt', 'file:///b.txt'])).toBe('2')
  expect(getDragLabel(['file:///a.txt', 'file:///b.txt', 'file:///c.txt'])).toBe('3')
})

test('getDragLabel - empty', () => {
  expect(getDragLabel([])).toBe('0')
})

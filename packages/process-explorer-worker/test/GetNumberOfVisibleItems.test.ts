import { expect, test } from '@jest/globals'
import * as GetNumberOfVisibleItems from '../src/parts/GetNumberOfVisibleItems/GetNumberOfVisibleItems.ts'

test('getNumberOfVisibleItems - empty state', () => {
  expect(GetNumberOfVisibleItems.getNumberOfVisibleItems(600, 22)).toBe(29)
})

test('getNumberOfVisibleItems - partial height', () => {
  expect(GetNumberOfVisibleItems.getNumberOfVisibleItems(100, 22)).toBe(6)
})

test('getNumberOfVisibleItems - exact division', () => {
  expect(GetNumberOfVisibleItems.getNumberOfVisibleItems(88, 22)).toBe(5)
})

test('getNumberOfVisibleItems - small height', () => {
  expect(GetNumberOfVisibleItems.getNumberOfVisibleItems(10, 22)).toBe(2)
})

test('getNumberOfVisibleItems - zero height', () => {
  expect(GetNumberOfVisibleItems.getNumberOfVisibleItems(0, 22)).toBe(0)
})

test('getNumberOfVisibleItems - negative height', () => {
  expect(GetNumberOfVisibleItems.getNumberOfVisibleItems(-100, 22)).toBe(0)
})

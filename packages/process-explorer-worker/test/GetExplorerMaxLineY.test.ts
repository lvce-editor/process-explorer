import { expect, test } from '@jest/globals'
import * as GetExplorerMaxLineY from '../src/parts/GetMaxLineY/GetMaxLineY.ts'

test('getExplorerMaxLineY - basic functionality', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 100, 20, 10)).toBe(6)
})

test('getExplorerMaxLineY - with offset minLineY', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(50, 100, 20, 10)).toBe(56)
})

test('getExplorerMaxLineY - direntsLength smaller than visible items', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 200, 20, 3)).toBe(3)
})

test('getExplorerMaxLineY - direntsLength larger than visible items', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 100, 20, 20)).toBe(6)
})

test('getExplorerMaxLineY - exact fit', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 100, 20, 6)).toBe(6)
})

test('getExplorerMaxLineY - zero height', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 0, 20, 10)).toBe(0)
})

test('getExplorerMaxLineY - zero itemHeight', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 100, 0, 10)).toBe(0)
})

test('getExplorerMaxLineY - negative height', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, -100, 20, 10)).toBe(0)
})

test('getExplorerMaxLineY - negative itemHeight', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 100, -20, 10)).toBe(0)
})

test('getExplorerMaxLineY - zero direntsLength', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 100, 20, 0)).toBe(0)
})

test('getExplorerMaxLineY - small height with small itemHeight', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 10, 5, 10)).toBe(3)
})

test('getExplorerMaxLineY - large height with small itemHeight', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 1000, 10, 50)).toBe(50)
})

test('getExplorerMaxLineY - partial height division', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 75, 20, 10)).toBe(5)
})

test('getExplorerMaxLineY - negative minLineY', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(-10, 100, 20, 10)).toBe(-4)
})

test('getExplorerMaxLineY - very small height', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 1, 20, 10)).toBe(2)
})

test('getExplorerMaxLineY - height smaller than itemHeight', () => {
  expect(GetExplorerMaxLineY.getExplorerMaxLineY(0, 10, 20, 10)).toBe(2)
})

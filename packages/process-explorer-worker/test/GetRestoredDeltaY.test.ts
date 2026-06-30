import { expect, test } from '@jest/globals'
import * as GetRestoredDeltaY from '../src/parts/GetRestoredDeltaY/GetRestoredDeltaY.ts'

test('getRestoredDeltaY - returns saved deltaY when it is numeric', () => {
  expect(GetRestoredDeltaY.getRestoredDeltaY({ deltaY: 42 })).toBe(42)
})

test('getRestoredDeltaY - returns 0 when deltaY is missing', () => {
  expect(GetRestoredDeltaY.getRestoredDeltaY({})).toBe(0)
})

test('getRestoredDeltaY - returns 0 when state is undefined', () => {
  expect(GetRestoredDeltaY.getRestoredDeltaY(undefined)).toBe(0)
})

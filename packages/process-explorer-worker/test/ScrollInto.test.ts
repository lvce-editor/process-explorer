import { test, expect } from '@jest/globals'
import { scrollInto } from '../src/parts/ScrollInto/ScrollInto.ts'

test('when index is below minLineY', () => {
  const result = scrollInto(5, 10, 20)
  expect(result).toEqual({
    newMaxLineY: 10,
    newMinLineY: 0,
  })
})

test('when index is above maxLineY', () => {
  const result = scrollInto(25, 10, 20)
  expect(result).toEqual({
    newMaxLineY: 30,
    newMinLineY: 20,
  })
})

test('when index is within range', () => {
  const result = scrollInto(15, 10, 20)
  expect(result).toEqual({
    newMaxLineY: 20,
    newMinLineY: 10,
  })
})

test('when range is odd', () => {
  const result = scrollInto(5, 10, 21)
  expect(result).toEqual({
    newMaxLineY: 11,
    newMinLineY: 0,
  })
})

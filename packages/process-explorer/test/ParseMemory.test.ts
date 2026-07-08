import { expect, test } from '@jest/globals'
import * as ParseMemory from '../src/parts/ParseMemory/ParseMemory.ts'

test('parseMemory - returns resident set size', () => {
  expect(ParseMemory.parseMemory('41700 2023 1199 224 0 5027 0')).toBe(
    8_286_208,
  )
})

test('parseMemory - does not subtract shared memory', () => {
  expect(ParseMemory.parseMemory('6500 6250 6000 224 0 5027 0')).toBe(
    25_600_000,
  )
})

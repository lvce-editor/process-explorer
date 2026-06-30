import { expect, test } from '@jest/globals'
import * as FormatMemory from '../src/parts/FormatMemory/FormatMemory.ts'

test('formatMemory', () => {
  expect(FormatMemory.formatMemory(999)).toBe('999 B')
  expect(FormatMemory.formatMemory(1500)).toBe('1.5 kB')
  expect(FormatMemory.formatMemory(1_500_000)).toBe('1.5 MB')
  expect(FormatMemory.formatMemory(1_500_000_000)).toBe('1.5 GB')
  expect(FormatMemory.formatMemory(1_500_000_000_000)).toBe('1.5 TB')
})

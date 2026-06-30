import { expect, test } from '@jest/globals'
import * as ChevronType from '../src/parts/ChevronType/ChevronType.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetChevronType from '../src/parts/GetChevronType/GetChevronType.ts'

test('getChevronType - chevrons disabled', () => {
  expect(GetChevronType.getChevronType(DirentType.Directory, false)).toBe(ChevronType.None)
})

test('getChevronType - directory', () => {
  expect(GetChevronType.getChevronType(DirentType.Directory, true)).toBe(ChevronType.Right)
})

test('getChevronType - directory expanded', () => {
  expect(GetChevronType.getChevronType(DirentType.DirectoryExpanded, true)).toBe(ChevronType.Down)
})

test('getChevronType - directory expanding', () => {
  expect(GetChevronType.getChevronType(DirentType.DirectoryExpanding, true)).toBe(ChevronType.Down)
})

test('getChevronType - file', () => {
  expect(GetChevronType.getChevronType(DirentType.File, true)).toBe(ChevronType.None)
})

test('getChevronType - symlink file', () => {
  expect(GetChevronType.getChevronType(DirentType.SymLinkFile, true)).toBe(ChevronType.None)
})

test('getChevronType - unknown type', () => {
  expect(GetChevronType.getChevronType(999_999, true)).toBe(ChevronType.None)
})

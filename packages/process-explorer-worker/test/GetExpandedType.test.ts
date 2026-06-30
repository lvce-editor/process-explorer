import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExpandedType from '../src/parts/ExpandedType/ExpandedType.ts'
import * as GetExpandedType from '../src/parts/GetExpandedType/GetExpandedType.ts'

test('getExpandedType - directory', () => {
  expect(GetExpandedType.getExpandedType(DirentType.Directory)).toBe(ExpandedType.Collapsed)
})

test('getExpandedType - directory expanding', () => {
  expect(GetExpandedType.getExpandedType(DirentType.DirectoryExpanding)).toBe(ExpandedType.Expanded)
})

test('getExpandedType - directory expanded', () => {
  expect(GetExpandedType.getExpandedType(DirentType.DirectoryExpanded)).toBe(ExpandedType.Expanded)
})

test('getExpandedType - file', () => {
  expect(GetExpandedType.getExpandedType(DirentType.File)).toBe(ExpandedType.None)
})

test('getExpandedType - symlink file', () => {
  expect(GetExpandedType.getExpandedType(DirentType.SymLinkFile)).toBe(ExpandedType.None)
})

test('getExpandedType - unknown type', () => {
  expect(GetExpandedType.getExpandedType(999_999)).toBe(ExpandedType.None)
})

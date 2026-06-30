import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as RestoreDirentType from '../src/parts/RestoreDirentType/RestoreDirentType.ts'

test('restoreDirentType - directory in expanded paths', () => {
  const result = RestoreDirentType.restoreDirentType(DirentType.Directory, '/test', ['/test'])
  expect(result).toBe(DirentType.DirectoryExpanded)
})

test('restoreDirentType - directory not in expanded paths', () => {
  const result = RestoreDirentType.restoreDirentType(DirentType.Directory, '/test', ['/other'])
  expect(result).toBe(DirentType.Directory)
})

test('restoreDirentType - non-directory type', () => {
  const result = RestoreDirentType.restoreDirentType(DirentType.File, '/test', ['/test'])
  expect(result).toBe(DirentType.File)
})

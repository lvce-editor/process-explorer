import { test, expect } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import { getSymlinkType } from '../src/parts/GetSymlinkType/GetSymlinkType.ts'

test('getSymlinkType - File', () => {
  expect(getSymlinkType(DirentType.File)).toBe(DirentType.SymLinkFile)
})

test('getSymlinkType - Directory', () => {
  expect(getSymlinkType(DirentType.Directory)).toBe(DirentType.SymLinkFolder)
})

test('getSymlinkType - Default', () => {
  expect(getSymlinkType(DirentType.BlockDevice)).toBe(DirentType.Symlink)
  expect(getSymlinkType(DirentType.CharacterDevice)).toBe(DirentType.Symlink)
  expect(getSymlinkType(DirentType.Socket)).toBe(DirentType.Symlink)
  expect(getSymlinkType(DirentType.Unknown)).toBe(DirentType.Symlink)
})

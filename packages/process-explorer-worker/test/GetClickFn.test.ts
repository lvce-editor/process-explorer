import { expect, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as GetClickFn from '../src/parts/GetClickFn/GetClickFn.ts'
import * as HandleClickDirectory from '../src/parts/HandleClickDirectory/HandleClickDirectory.ts'
import * as HandleClickDirectoryExpanded from '../src/parts/HandleClickDirectoryExpanded/HandleClickDirectoryExpanded.ts'
import * as HandleClickDirectoryExpanding from '../src/parts/HandleClickDirectoryExpanding/HandleClickDirectoryExpanding.ts'
import * as HandleClickFile from '../src/parts/HandleClickFile/HandleClickFile.ts'
import * as HandleClickSymlink from '../src/parts/HandleClickSymlink/HandleClickSymlink.ts'

test('getClickFn - file', () => {
  expect(GetClickFn.getClickFn(DirentType.File)).toBe(HandleClickFile.handleClickFile)
})

test('getClickFn - symlink file', () => {
  expect(GetClickFn.getClickFn(DirentType.SymLinkFile)).toBe(HandleClickFile.handleClickFile)
})

test('getClickFn - directory', () => {
  expect(GetClickFn.getClickFn(DirentType.Directory)).toBe(HandleClickDirectory.handleClickDirectory)
})

test('getClickFn - symlink folder', () => {
  expect(GetClickFn.getClickFn(DirentType.SymLinkFolder)).toBe(HandleClickDirectory.handleClickDirectory)
})

test('getClickFn - directory expanding', () => {
  expect(GetClickFn.getClickFn(DirentType.DirectoryExpanding)).toBe(HandleClickDirectoryExpanding.handleClickDirectoryExpanding)
})

test('getClickFn - directory expanded', () => {
  expect(GetClickFn.getClickFn(DirentType.DirectoryExpanded)).toBe(HandleClickDirectoryExpanded.handleClickDirectoryExpanded)
})

test('getClickFn - symlink', () => {
  expect(GetClickFn.getClickFn(DirentType.Symlink)).toBe(HandleClickSymlink.handleClickSymLink)
})

test('getClickFn - character device', () => {
  expect(() => GetClickFn.getClickFn(DirentType.CharacterDevice)).toThrow('Cannot open character device files')
})

test('getClickFn - block device', () => {
  expect(() => GetClickFn.getClickFn(DirentType.BlockDevice)).toThrow('Cannot open block device files')
})

test('getClickFn - socket', () => {
  expect(() => GetClickFn.getClickFn(DirentType.Socket)).toThrow('Cannot open socket files')
})

test('getClickFn - unknown type', () => {
  expect(() => GetClickFn.getClickFn(999_999)).toThrow('unsupported dirent type 999999')
})

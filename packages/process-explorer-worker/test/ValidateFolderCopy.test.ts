import { test, expect } from '@jest/globals'
import * as ValidateFolderCopy from '../src/parts/ValidateFolderCopy/ValidateFolderCopy.ts'

test('should return null when copying folder to different location', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///folder1', 'test:///folder2')
  expect(result).toBeNull()
})

test('should return null when copying file to different location', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///file.txt', 'test:///folder')
  expect(result).toBeNull()
})

test('should return error when copying folder into its own subfolder', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///folder1', 'test:///folder1/subfolder')
  expect(result).toBe('Cannot copy folder folder1 into a subfolder of itself')
})

test('should return error when copying folder into nested subfolder', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///folder1', 'test:///folder1/subfolder/nested')
  expect(result).toBe('Cannot copy folder folder1 into a subfolder of itself')
})

test('should return error with Windows path separators', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///folder1', 'test:///folder1\\subfolder')
  expect(result).toBe('Cannot copy folder folder1 into a subfolder of itself')
})

test('should return null when paths are exactly the same', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///folder1', 'test:///folder1')
  expect(result).toBeNull()
})

test('should return null when target is parent of source', () => {
  const result = ValidateFolderCopy.validateFolderCopy('test:///folder1/subfolder', 'test:///folder1')
  expect(result).toBeNull()
})

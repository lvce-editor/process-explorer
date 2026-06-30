import { test, expect } from '@jest/globals'
import * as ValidateFileName2 from '../src/parts/ValidateFileName2/ValidateFileName2.ts'

test('validateFileName2 - empty name', () => {
  const result = ValidateFileName2.validateFileName2('')
  expect(result).toBe('A file or folder name must be provided.')
})

test('validateFileName2 - name starting with dot (allowed)', () => {
  const result = ValidateFileName2.validateFileName2('.hidden')
  expect(result).toBe('')
})

test('validateFileName2 - dotfile like .git (allowed)', () => {
  const result = ValidateFileName2.validateFileName2('.git')
  expect(result).toBe('')
})

test('validateFileName2 - dotfile like .editorconfig (allowed)', () => {
  const result = ValidateFileName2.validateFileName2('.editorconfig')
  expect(result).toBe('')
})

test('validateFileName2 - reserved name "." (not allowed)', () => {
  const result = ValidateFileName2.validateFileName2('.')
  expect(result).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('validateFileName2 - reserved name ".." (not allowed)', () => {
  const result = ValidateFileName2.validateFileName2('..')
  expect(result).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('validateFileName2 - reserved name "..." (not allowed)', () => {
  const result = ValidateFileName2.validateFileName2('...')
  expect(result).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('validateFileName2 - reserved name "../" (not allowed)', () => {
  const result = ValidateFileName2.validateFileName2('../')
  expect(result).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('validateFileName2 - name starting with "../" (not allowed)', () => {
  const result = ValidateFileName2.validateFileName2('../file.txt')
  expect(result).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('validateFileName2 - name starting with "../" folder (not allowed)', () => {
  const result = ValidateFileName2.validateFileName2('../folder')
  expect(result).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('validateFileName2 - name starting with slash', () => {
  const result = ValidateFileName2.validateFileName2('/file')
  expect(result).toBe('A file or folder name cannot start with a slash.')
})

test('validateFileName2 - name starting with backslash', () => {
  const result = ValidateFileName2.validateFileName2('\\file')
  expect(result).toBe('A file or folder name cannot start with a backslash.')
})

test('validateFileName2 - valid name', () => {
  const result = ValidateFileName2.validateFileName2('valid-file.txt')
  expect(result).toBe('')
})

test('validateFileName2 - file already exists', () => {
  const siblingFileNames = ['existing-file.txt', 'another-file.js']
  const result = ValidateFileName2.validateFileName2('existing-file.txt', siblingFileNames)
  expect(result).toBe('A file or folder **existing-file.txt** already exists at this location. Please choose a different name.')
})

test('validateFileName2 - file does not exist', () => {
  const siblingFileNames = ['existing-file.txt', 'another-file.js']
  const result = ValidateFileName2.validateFileName2('new-file.txt', siblingFileNames)
  expect(result).toBe('')
})

import { expect, test } from '@jest/globals'
import { generateUniqueName } from '../src/parts/GenerateUniqueName/GenerateUniqueName.ts'

test('generateUniqueName - no conflict', () => {
  const result = generateUniqueName('file.txt', ['/test/other.txt'], '/test')
  expect(result).toBe('file.txt')
})

test('generateUniqueName - single conflict', () => {
  const result = generateUniqueName('file.txt', ['/test/file.txt'], '/test')
  expect(result).toBe('file copy.txt')
})

test('generateUniqueName - multiple conflicts', () => {
  const result = generateUniqueName('file.txt', ['/test/file.txt', '/test/file copy.txt'], '/test')
  expect(result).toBe('file copy 1.txt')
})

test('generateUniqueName - multiple numbered conflicts', () => {
  const result = generateUniqueName('file.txt', ['/test/file.txt', '/test/file copy.txt', '/test/file copy 1.txt', '/test/file copy 2.txt'], '/test')
  expect(result).toBe('file copy 3.txt')
})

test('generateUniqueName - file without extension', () => {
  const result = generateUniqueName('README', ['/test/README'], '/test')
  expect(result).toBe('README copy')
})

test('generateUniqueName - file without extension multiple conflicts', () => {
  const result = generateUniqueName('README', ['/test/README', '/test/README copy', '/test/README copy 1'], '/test')
  expect(result).toBe('README copy 2')
})

test('generateUniqueName - file starting with dot', () => {
  const result = generateUniqueName('.gitignore', ['/test/.gitignore'], '/test')
  expect(result).toBe('.gitignore copy')
})

test('generateUniqueName - file ending with dot', () => {
  const result = generateUniqueName('file.', ['/test/file.'], '/test')
  expect(result).toBe('file. copy')
})

test('generateUniqueName - file with multiple dots', () => {
  const result = generateUniqueName('file.backup.txt', ['/test/file.backup.txt'], '/test')
  expect(result).toBe('file.backup copy.txt')
})

test('generateUniqueName - file with only dot', () => {
  const result = generateUniqueName('.', ['/test/.'], '/test')
  expect(result).toBe('. copy')
})

test('generateUniqueName - empty filename', () => {
  const result = generateUniqueName('', ['/test/'], '/test')
  expect(result).toBe(' copy')
})

test('generateUniqueName - filename with spaces', () => {
  const result = generateUniqueName('my file.txt', ['/test/my file.txt'], '/test')
  expect(result).toBe('my file copy.txt')
})

test('generateUniqueName - filename with special characters', () => {
  const result = generateUniqueName('file@#$%.txt', ['/test/file@#$%.txt'], '/test')
  expect(result).toBe('file@#$% copy.txt')
})

test('generateUniqueName - filename with numbers', () => {
  const result = generateUniqueName('file123.txt', ['/test/file123.txt'], '/test')
  expect(result).toBe('file123 copy.txt')
})

test('generateUniqueName - filename that looks like a copy', () => {
  const result = generateUniqueName('file copy.txt', ['/test/file copy.txt'], '/test')
  expect(result).toBe('file copy copy.txt')
})

test('generateUniqueName - filename that looks like a numbered copy', () => {
  const result = generateUniqueName('file copy 1.txt', ['/test/file copy 1.txt'], '/test')
  expect(result).toBe('file copy 1 copy.txt')
})

test('generateUniqueName - complex extension', () => {
  const result = generateUniqueName('file.tar.gz', ['/test/file.tar.gz'], '/test')
  expect(result).toBe('file.tar copy.gz')
})

test('generateUniqueName - hidden file with extension', () => {
  const result = generateUniqueName('.config.json', ['/test/.config.json'], '/test')
  expect(result).toBe('.config copy.json')
})

test('generateUniqueName - very long filename', () => {
  const longName = 'a'.repeat(100) + '.txt'
  const result = generateUniqueName(longName, [`/test/${longName}`], '/test')
  expect(result).toBe('a'.repeat(100) + ' copy.txt')
})

test('generateUniqueName - unicode filename', () => {
  const result = generateUniqueName('café.txt', ['/test/café.txt'], '/test')
  expect(result).toBe('café copy.txt')
})

test('generateUniqueName - filename with emoji', () => {
  const result = generateUniqueName('file🚀.txt', ['/test/file🚀.txt'], '/test')
  expect(result).toBe('file🚀 copy.txt')
})

test('generateUniqueName - case sensitive', () => {
  const result = generateUniqueName('File.txt', ['/test/file.txt'], '/test')
  expect(result).toBe('File.txt')
})

test('generateUniqueName - different root path', () => {
  const result = generateUniqueName('file.txt', ['/different/file.txt'], '/test')
  expect(result).toBe('file.txt')
})

test('generateUniqueName - root path with trailing slash', () => {
  const result = generateUniqueName('file.txt', ['/test/file.txt'], '/test/')
  expect(result).toBe('file copy.txt')
})

test('generateUniqueName - multiple conflicts with gaps', () => {
  const result = generateUniqueName('file.txt', ['/test/file.txt', '/test/file copy.txt', '/test/file copy 3.txt'], '/test')
  expect(result).toBe('file copy 1.txt')
})

test('generateUniqueName - filename with copy in middle', () => {
  const result = generateUniqueName('copyfile.txt', ['/test/copyfile.txt'], '/test')
  expect(result).toBe('copyfile copy.txt')
})

test('generateUniqueName - filename ending with copy', () => {
  const result = generateUniqueName('mycopy.txt', ['/test/mycopy.txt'], '/test')
  expect(result).toBe('mycopy copy.txt')
})

test('generateUniqueName - filename with copy and number', () => {
  const result = generateUniqueName('filecopy1.txt', ['/test/filecopy1.txt'], '/test')
  expect(result).toBe('filecopy1 copy.txt')
})

import { test, expect } from '@jest/globals'
import { dirname, join, getBaseName } from '../src/parts/Path/Path.ts'

test('dirname returns parent directory', () => {
  expect(dirname('/', '/home/user/file.txt')).toBe('/home/user')
  expect(dirname('/', '/home/user/')).toBe('/home/user')
  expect(dirname('/', '/home/user')).toBe('/home')
  expect(dirname('/', 'file.txt')).toBe('file.txt')
  expect(dirname('/', '/')).toBe('')
})

test('join combines path parts', () => {
  expect(join('/', 'home', 'user', 'file.txt')).toBe('home/user/file.txt')
  expect(join('/', 'home', 'user', '')).toBe('home/user/')
  expect(join('/', 'home', 'user')).toBe('home/user')
  expect(join('/', '', 'home', 'user')).toBe('/home/user')
})

test('getBaseName returns last path component', () => {
  expect(getBaseName('/', '/home/user/file.txt')).toBe('file.txt')
  expect(getBaseName('/', '/home/user/')).toBe('')
  expect(getBaseName('/', '/home/user')).toBe('user')
  expect(getBaseName('/', 'file.txt')).toBe('file.txt')
  expect(getBaseName('/', '/')).toBe('')
})

import { expect, test } from '@jest/globals'
import * as GetProcessDisplayNameCached from '../src/parts/GetProcessDisplayNameCached/GetProcessDisplayNameCached.ts'

test('getName reuses command results and preserves immutable cache state', () => {
  const cache = Object.create(null)
  const cacheDraft = Object.assign(Object.create(null), cache)
  const first = GetProcessDisplayNameCached.getName(
    1,
    'node dist/ptyHostMain.js',
    0,
    {},
    cacheDraft,
  )
  const second = GetProcessDisplayNameCached.getName(
    2,
    'node dist/ptyHostMain.js',
    0,
    {},
    cacheDraft,
  )
  expect(first).toBe('pty-host')
  expect(second).toBe(first)
  expect(cacheDraft['node dist/ptyHostMain.js'].name).toBe(first)
  expect(cache).toEqual({})
})

test.each([
  'extension-builtin.remote-ssh:remote-SSH',
  'extension-builtin.remote-ssh:-remote-SSH',
])(
  'getName normalizes remote ssh extension name %s from pid map',
  (processName) => {
    const displayNameCache = Object.create(null)
    expect(
      GetProcessDisplayNameCached.getName(
        123,
        'remote ssh extension',
        1,
        { 123: processName },
        displayNameCache,
      ),
    ).toBe('remote-ssh')
  },
)

test('getName retains root and pid map overrides for cached commands', () => {
  const cmd = 'unknown command'
  const cache = Object.create(null)
  GetProcessDisplayNameCached.getName(1, cmd, 0, {}, cache)
  expect(GetProcessDisplayNameCached.getName(2, cmd, 2, {}, cache)).toBe('main')
  expect(
    GetProcessDisplayNameCached.getName(
      1,
      cmd,
      0,
      { 1: 'dynamic-name' },
      cache,
    ),
  ).toBe('dynamic-name')
})

test('getName safely caches prototype-like command strings', () => {
  const result = GetProcessDisplayNameCached.getName(
    1,
    '__proto__',
    0,
    {},
    Object.create(null),
  )
  expect(result).toBe('__proto__')
})

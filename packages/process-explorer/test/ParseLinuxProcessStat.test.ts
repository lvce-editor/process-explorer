import { expect, test } from '@jest/globals'
import * as ParseLinuxProcessStat from '../src/parts/ParseLinuxProcessStat/ParseLinuxProcessStat.ts'

test('rejects process stat content without a command delimiter', () => {
  expect(() => ParseLinuxProcessStat.parseLinuxProcessStat('123 1 2')).toThrow(
    new TypeError('Invalid process stat'),
  )
})

test('rejects a non-numeric process id', () => {
  const fields = Array.from({ length: 22 }, (_value, index) =>
    index === 1 ? '1' : '0',
  )

  expect(() =>
    ParseLinuxProcessStat.parseLinuxProcessStat(
      `not-a-pid (node) ${fields.join(' ')}`,
    ),
  ).toThrow(new TypeError('Invalid process stat'))
})

test('parses command names containing parentheses', () => {
  const fields = Array.from({ length: 22 }, (_value, index) => {
    if (index === 1) return '1'
    if (index === 21) return '2'
    return '0'
  })

  expect(
    ParseLinuxProcessStat.parseLinuxProcessStat(
      `123 (node (worker)) ${fields.join(' ')}`,
    ),
  ).toEqual({
    command: 'node (worker)',
    memory: 8192,
    pid: 123,
    ppid: 1,
  })
})

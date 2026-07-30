import { expect, test } from '@jest/globals'
import * as ParsePsOutputLine from '../src/parts/ParsePsOutputLine/ParsePsOutputLine.ts'

test('parsePsOutputLine - converts RSS from KiB to bytes', () => {
  expect(
    ParsePsOutputLine.parsePsOutputLine(
      '6343 6341 0.8 12800 /Applications/Lvce.app/Contents/MacOS/Lvce',
    ),
  ).toEqual({
    cmd: '/Applications/Lvce.app/Contents/MacOS/Lvce',
    memory: 13_107_200,
    pid: 6343,
    ppid: 6341,
  })
})

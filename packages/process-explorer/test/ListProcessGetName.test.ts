import { expect, test } from '@jest/globals'
import * as ListProcessGetName from '../src/parts/ListProcessGetName/ListProcessGetName.ts'

test.each([
  'node main.js',
  'electron --type=renderer',
  'node sharedProcessMain.js',
  String.raw`C:\tools\language-server\zls.exe`,
])(
  'collector retains raw command regardless of root or Electron metadata: %s',
  (cmd) => {
    expect(ListProcessGetName.getName(1, cmd, 1, { 1: 'friendly' })).toBe(cmd)
    expect(ListProcessGetName.getName(2, cmd, 1, { 2: 'friendly' })).toBe(cmd)
  },
)

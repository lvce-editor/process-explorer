import { expect, test } from '@jest/globals'
import * as GetInspectorPortsFromCommand from '../src/parts/GetInspectorPortsFromCommand/GetInspectorPortsFromCommand.ts'

test('returns the common inspector ports', () => {
  expect(
    GetInspectorPortsFromCommand.getInspectorPortsFromCommand('node app.js'),
  ).toEqual([9000, 9229])
})

test('finds inspector ports in node options', () => {
  expect(
    GetInspectorPortsFromCommand.getInspectorPortsFromCommand(
      'node --inspect=127.0.0.1:9230 --inspect-port 9231 app.js',
    ),
  ).toEqual([9000, 9229, 9230, 9231])
})

test('ignores random and invalid inspector ports', () => {
  expect(
    GetInspectorPortsFromCommand.getInspectorPortsFromCommand(
      'node --inspect-port=0 --inspect=localhost:99999 --inspect-wait=localhost app.js',
    ),
  ).toEqual([9000, 9229])
})

import { expect, test } from '@jest/globals'
import * as CommandMap from '../src/parts/CommandMap/CommandMap.ts'
import * as HandleElectronMessagePort from '../src/parts/HandleElectronMessagePort/HandleElectronMessagePort.ts'
import * as HandleMessagePort from '../src/parts/HandleMessagePort/HandleMessagePort.ts'
import * as HandleSocket from '../src/parts/HandleSocket/HandleSocket.ts'
import * as HandleWebSocket from '../src/parts/HandleWebSocket/HandleWebSocket.ts'
import * as KillProcess from '../src/parts/KillProcess/KillProcess.ts'

test('commandMap exposes rpc handoff commands', () => {
  expect(
    CommandMap.commandMap[
      'HandleElectronMessagePort.handleElectronMessagePort'
    ],
  ).toBe(HandleElectronMessagePort.handleElectronMessagePort)
  expect(CommandMap.commandMap['HandleMessagePort.handleMessagePort']).toBe(
    HandleMessagePort.handleMessagePort,
  )
  expect(CommandMap.commandMap['HandleSocket.handleSocket']).toBe(
    HandleSocket.handleSocket,
  )
  expect(CommandMap.commandMap['HandleWebSocket.handleWebSocket']).toBe(
    HandleWebSocket.handleWebSocket,
  )
  expect(CommandMap.commandMap['Process.kill']).toBe(KillProcess.killProcess)
})

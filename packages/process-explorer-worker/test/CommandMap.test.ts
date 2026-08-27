import { expect, test } from '@jest/globals'
import * as CommandMap from '../src/parts/CommandMap/CommandMap.ts'

test('commandMap exposes context menu commands', () => {
  expect(CommandMap.commandMap['ProcessExplorer.getMenuEntries']).toEqual(
    expect.any(Function),
  )
  expect(CommandMap.commandMap['ProcessExplorer.getMenuEntryIds']).toEqual(
    expect.any(Function),
  )
  expect(CommandMap.commandMap['ProcessExplorer.killProcess']).toEqual(
    expect.any(Function),
  )
  expect(CommandMap.commandMap['ProcessExplorer.rerender']).toEqual(
    expect.any(Function),
  )
  expect(
    CommandMap.commandMap['ProcessExplorer.createE2eFixtureProcess'],
  ).toEqual(expect.any(Function))
  expect(
    CommandMap.commandMap['ProcessExplorer.disposeE2eFixtureProcess'],
  ).toEqual(expect.any(Function))
  expect(CommandMap.commandMap['ProcessExplorer.debugProcess']).toEqual(
    expect.any(Function),
  )
  expect(CommandMap.commandMap['ProcessExplorer.setError']).toEqual(
    expect.any(Function),
  )
  expect(CommandMap.commandMap['ProcessExplorer.setRootProcessId']).toEqual(
    expect.any(Function),
  )
})

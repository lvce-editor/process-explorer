import { expect, test } from '@jest/globals'
import * as IsRendererProcess from '../src/parts/IsRendererProcess/IsRendererProcess.ts'

const createProcess = (
  name: string,
): {
  readonly cmd: string
  readonly memory: number
  readonly name: string
  readonly pid: number
  readonly ppid: number
} => ({
  cmd: name,
  memory: 1,
  name,
  pid: 1,
  ppid: 0,
})

test.each([
  'webcontentsview, soundcloud.com',
  'webcontents-view / soundcloud.com',
])('isRendererProcess - web contents view (%s)', (name) => {
  expect(IsRendererProcess.isRendererProcess(createProcess(name))).toBe(true)
})

test('isRendererProcess - remote web contents view', () => {
  expect(
    IsRendererProcess.isRendererProcess({
      ...createProcess('webcontents-view / soundcloud.com'),
      source: 'remote',
    }),
  ).toBe(false)
})

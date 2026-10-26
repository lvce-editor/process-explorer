import { expect, test } from '@jest/globals'
import * as GetListProcessesWithMemoryUsageModule from '../src/parts/GetListProcessesWithMemoryUsageModule/GetListProcessesWithMemoryUsageModule.ts'

test('loads the Windows process enumeration module', async () => {
  const module = await GetListProcessesWithMemoryUsageModule.getModule(true)

  expect(module.listProcessesWithMemoryUsage).toEqual(expect.any(Function))
})

test('loads the Unix process enumeration module', async () => {
  const module = await GetListProcessesWithMemoryUsageModule.getModule(false)

  expect(module.listProcessesWithMemoryUsage).toEqual(expect.any(Function))
})

test('defaults to the process enumeration module for the current platform', async () => {
  const module = await GetListProcessesWithMemoryUsageModule.getModule()

  expect(module.listProcessesWithMemoryUsage).toEqual(expect.any(Function))
})

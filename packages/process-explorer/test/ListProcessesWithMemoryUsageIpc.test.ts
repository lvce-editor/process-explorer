import { expect, test } from '@jest/globals'
import * as ListProcessesWithMemoryUsageIpc from '../src/parts/ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ipc.ts'
import * as ListProcessesWithMemoryUsage from '../src/parts/ListProcessesWithMemoryUsage/ListProcessesWithMemoryUsage.ts'

test('name', () => {
  expect(ListProcessesWithMemoryUsageIpc.name).toBe(
    'ListProcessesWithMemoryUsage',
  )
})

test('Commands', () => {
  expect(
    ListProcessesWithMemoryUsageIpc.Commands.listProcessesWithMemoryUsage,
  ).toBe(ListProcessesWithMemoryUsage.listProcessesWithMemoryUsage)
})

import { expect, test } from '@jest/globals'
import type { ViewletAction } from '../src/parts/ViewletAction/ViewletAction.ts'
import * as ActionType from '../src/parts/ActionType/ActionType.ts'
import { getActionVirtualDom } from '../src/parts/GetActionVirtualDom/GetActionVirtualDom.ts'

test('getActionVirtualDom - button action', () => {
  const action: ViewletAction = {
    command: 'test.command',
    icon: 'test-icon',
    id: 'test-button',
    type: ActionType.Button,
  }
  const result = getActionVirtualDom(action)
  expect(result).toHaveLength(2)
  expect(result[0].type).toBe(1)
})

test('getActionVirtualDom - unknown action type', () => {
  const action: ViewletAction = {
    command: 'test.command',
    id: 'test-unknown',
    type: 999, // Using a number that's not defined in ActionType
  }
  const result = getActionVirtualDom(action)
  expect(result).toEqual([])
})

import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import * as ApplyRender from '../src/parts/ApplyRender/ApplyRender.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import { createProcessState } from './fixtures/ProcessExplorerFixtures.ts'

test('applyRender ignores empty render results', () => {
  const state = createProcessState({
    focused: true,
    focusedIndex: 0,
  })
  const commands = ApplyRender.applyRender(state, state, [DiffType.RenderFocus])
  expect(commands).toEqual([])
})

test('applyRender returns non-empty render results', () => {
  const oldState = createProcessState()
  const newState = createProcessState({
    initial: false,
  })
  const commands = ApplyRender.applyRender(oldState, newState, [
    DiffType.RenderFocus,
    DiffType.RenderItems,
  ])
  expect(commands).toHaveLength(1)
  expect(commands[0][0]).toBe(ViewletCommand.SetDom2)
})

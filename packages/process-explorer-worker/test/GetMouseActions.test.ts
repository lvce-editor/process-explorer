import { test, expect } from '@jest/globals'
import { getMouseActions } from '../src/parts/GetMouseActions/GetMouseActions.ts'

test('should return mouse actions array', () => {
  const actions = getMouseActions()
  expect(Array.isArray(actions)).toBe(true)
  expect(actions.length).toBeGreaterThan(0)
  for (const action of actions) {
    expect(action).toHaveProperty('description')
    expect(action).toHaveProperty('button')
    expect(action).toHaveProperty('command')
    expect(action).toHaveProperty('when')
  }
})

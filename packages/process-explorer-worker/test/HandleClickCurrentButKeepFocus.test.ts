import { test, expect, jest } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { handleClickCurrentButKeepFocus } from '../src/parts/HandleClickCurrentButKeepFocus/HandleClickCurrentButKeepFocus.ts'

test('handleClickCurrentButKeepFocus', async () => {
  const state = createDefaultState()
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  const newState = await handleClickCurrentButKeepFocus(state)
  expect(newState).toBeDefined()
  expect(spy).toHaveBeenCalledTimes(1)
})

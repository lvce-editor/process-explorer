import { expect, test } from '@jest/globals'
import * as RenderEventListeners from '../src/parts/RenderEventListeners/RenderEventListeners.ts'

test('renderEventListeners', () => {
  const eventListeners = RenderEventListeners.renderEventListeners()
  expect(eventListeners).toBeDefined()
})

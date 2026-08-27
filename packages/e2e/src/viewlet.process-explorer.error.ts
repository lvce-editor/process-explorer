import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.error'

const fixtureMessage = 'Process Explorer e2e fixture error'
const fixtureThrowLine = `throw new Error('${fixtureMessage}')`

const getFixtureUrl = (): string => {
  return import.meta.url.replace(
    '/src/viewlet.process-explorer.error.ts',
    '/fixtures/processExplorerErrorFixture.ts',
  )
}

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const fixtureUrl = getFixtureUrl()
  const stackLine = `createProcessExplorerE2eError (${fixtureUrl}:2:9)`

  // act
  await Command.execute('ProcessExplorer.setError', {
    code: 'ERR_PROCESS_EXPLORER_E2E',
    message: fixtureMessage,
    stack: `Error: ${fixtureMessage}\n    at ${stackLine}`,
  })

  // assert
  const error = Locator('.ProcessExplorerError')
  const table = Locator('.ProcessExplorerTable')
  try {
    await expect(error).toBeVisible()
    await expect(table).toBeHidden()
    await expect(error).toContainText(fixtureMessage)
    await expect(error).toContainText(fixtureThrowLine)
    await expect(error).toContainText(stackLine)
  } finally {
    await Command.execute('ProcessExplorer.refresh')
  }
}

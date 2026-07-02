import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.error'

const fixtureMessage = 'Process Explorer e2e fixture error'
const fixtureThrowLine = `throw new Error('${fixtureMessage}')`

const getPathFromUrl = (urlString: string): string => {
  const url = new URL(urlString)
  const pathname = decodeURIComponent(url.pathname)
  if (pathname.startsWith('/remote/')) {
    return pathname.slice('/remote'.length)
  }
  return pathname
}

const getFixturePath = (): string => {
  const currentPath = getPathFromUrl(import.meta.url)
  return currentPath.replace(
    '/src/viewlet.process-explorer.error.ts',
    '/fixtures/processExplorerErrorFixture.ts',
  )
}

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const fixturePath = getFixturePath()
  const stackLine = `createProcessExplorerE2eError (${fixturePath}:2:9)`

  // act
  await Command.execute('ProcessExplorer.setError', {
    code: 'ERR_PROCESS_EXPLORER_E2E',
    message: fixtureMessage,
    stack: `Error: ${fixtureMessage}\n    at ${stackLine}`,
  })

  // assert
  const error = Locator('.ProcessExplorerError')
  const table = Locator('.ProcessExplorerTable')
  await expect(error).toBeVisible()
  await expect(table).toBeHidden()
  await expect(error).toContainText(fixtureMessage)
  await expect(error).toContainText(fixtureThrowLine)
  await expect(error).toContainText(stackLine)
}

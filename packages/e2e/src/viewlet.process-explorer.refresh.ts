import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.refresh'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const table = Locator('.ProcessExplorerTable')

  // act
  await Command.execute('ProcessExplorer.refresh')

  // assert
  const error = Locator('.ProcessExplorerError')
  await expect(table).toBeVisible()
  await expect(error).toBeHidden()
}

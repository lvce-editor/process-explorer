import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-header-row'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const headerRow = Locator('.ProcessExplorerTableHead > tr.ProcessExplorerRow')
  await expect(headerRow).toBeVisible()
  await expect(headerRow).toHaveAttribute('role', 'row')
}

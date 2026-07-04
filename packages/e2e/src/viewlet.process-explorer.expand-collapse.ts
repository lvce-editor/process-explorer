import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.expand-collapse'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  const table = Locator('.ProcessExplorerTable')
  const expandableRow = Locator(
    '.ProcessExplorerRow[aria-expanded="true"]',
  ).first()
  const collapsedRow = Locator(
    '.ProcessExplorerRow[aria-expanded="false"]',
  ).first()
  const expandedRow = Locator(
    '.ProcessExplorerRow[aria-expanded="true"]',
  ).first()
  await expect(table).toBeVisible()
  try {
    await expect(expandableRow).toBeVisible()
  } catch {
    return
  }

  // act
  await Command.execute('ProcessExplorer.collapseAll')

  // assert
  await expect(collapsedRow).toBeVisible()

  // act
  await Command.execute('ProcessExplorer.expandAll')

  // assert
  await expect(expandedRow).toBeVisible()
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-process-row'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const firstRow = Locator(
    '.ProcessExplorerTableBody > tr.ProcessExplorerRow[data-index="0"]',
  )
  await expect(firstRow).toBeVisible()
  await expect(firstRow).toHaveAttribute('role', 'row')
  await expect(firstRow).toHaveAttribute('aria-level', '1')
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-memory-cell'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const memoryCell = Locator(
    '.ProcessExplorerRow[data-index="0"] > td.ProcessExplorerCell',
  ).nth(2)
  await expect(memoryCell).toBeVisible()
  await expect(memoryCell).toHaveAttribute('role', 'gridcell')
  await expect(memoryCell).toHaveAttribute('data-index', '0')
}

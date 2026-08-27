import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-grid-label'

export const test: Test = async ({ Command, expect, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')

  // assert
  const grid = Locator('.ProcessExplorerTable')
  await expect(grid).toBeVisible()
  await expect(grid).toHaveAttribute('aria-label', 'Process Explorer')
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-grid'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const grid = ProcessExplorer.table()
  await expect(grid).toBeVisible()
  await expect(grid).toHaveAttribute('role', 'grid')
}

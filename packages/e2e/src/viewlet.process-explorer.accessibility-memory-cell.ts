import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.accessibility-memory-cell'

export const test: Test = async ({ expect, ProcessExplorer }) => {
  // arrange
  await ProcessExplorer.open()

  // assert
  const memoryCell = ProcessExplorer.memoryCell(1)
  await expect(memoryCell).toBeVisible()
  await expect(memoryCell).toHaveAttribute('role', 'gridcell')
  await expect(memoryCell).toHaveAttribute('data-index', '0')
}

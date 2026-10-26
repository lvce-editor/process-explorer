import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.arrow-left-parent'
export const test: Test = async ({ Command, expect, KeyBoard, Locator }) => {
  await Command.execute('Developer.openProcessExplorer')
  const table = Locator('.ProcessExplorerTable')
  const parent = Locator('.ProcessExplorerRow[data-index="0"]')
  const childIndex = 1
  const child = Locator('.ProcessExplorerRow[data-index="1"]')
  try {
    await Command.execute('ProcessExplorer.setUpdateInterval', -1)
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.refresh')
    await Command.execute('ProcessExplorer.expandAll')
    await expect(table).toBeVisible()
    await expect(parent).toBeVisible()
    await expect(parent).toHaveAttribute('aria-expanded', 'true')
    await expect(child).toBeVisible()
    // Collapse descendants so ArrowLeft moves to the parent instead of collapsing the child.
    await Command.execute('ProcessExplorer.collapseAll')
    await Command.execute('ProcessExplorer.handleClickAt', 0)
    await Command.execute('ProcessExplorer.handleArrowRight')
    await expect(child).toBeVisible()
    await Command.execute('ProcessExplorer.handleClickAt', childIndex)
    await expect(child).toBeFocused()
    await KeyBoard.press('ArrowLeft')
    await expect(parent).toBeFocused()
    await expect(parent).toHaveAttribute('aria-expanded', 'true')
  } finally {
    await Command.execute('ProcessExplorer.expandAll')
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
    await Command.execute('ProcessExplorer.refresh')
  }
}

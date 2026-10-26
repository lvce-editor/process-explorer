import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.arrow-right-leaf'
export const test: Test = async ({ Command, expect, KeyBoard, Locator }) => {
  await Command.execute('Developer.openProcessExplorer')
  const table = Locator('.ProcessExplorerTable')
  const parent = Locator('.ProcessExplorerRow[data-index="0"]')
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
    const leaf = Locator(
      '.ProcessExplorerTableBody > .ProcessExplorerRow:not([aria-expanded]):last-child',
    )
    await expect(leaf).toBeVisible()
    await Command.execute('ProcessExplorer.handleClickAt', 0)
    await Command.execute('ProcessExplorer.focusLast')
    await expect(leaf).toBeFocused()
    await KeyBoard.press('ArrowRight')
    await expect(leaf).toBeFocused()
    await expect(child).toBeVisible()
  } finally {
    await Command.execute('ProcessExplorer.expandAll')
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
    await Command.execute('ProcessExplorer.refresh')
  }
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.keyboard-up-boundary'
export const test: Test = async ({ Command, expect, KeyBoard, Locator }) => {
  await Command.execute('Developer.openProcessExplorer')
  const table = Locator('.ProcessExplorerTable')
  const parent = Locator('.ProcessExplorerRow[data-index="0"]')
  const childIndex = 1
  const child = Locator(`.ProcessExplorerRow[data-index="${childIndex}"]`)
  try {
    await Command.execute('ProcessExplorer.setUpdateInterval', -1)
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.refresh')
    await Command.execute('ProcessExplorer.expandAll')
    await expect(table).toBeVisible()
    await expect(parent).toBeVisible()
    await expect(parent).toHaveAttribute('aria-expanded', 'true')
    await expect(child).toBeVisible()
    await Command.execute('ProcessExplorer.handleClickAt', 1)
    await Command.execute('ProcessExplorer.handleClickAt', 0)
    await expect(parent).toBeFocused()
    await KeyBoard.press('Home')
    await KeyBoard.press('ArrowUp')
    const focusedFirstRow = Locator(
      '.ProcessExplorerRowFocused[data-index="0"]',
    )
    await expect(focusedFirstRow).toBeFocused()
  } finally {
    await Command.execute('ProcessExplorer.expandAll')
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
    await Command.execute('ProcessExplorer.refresh')
  }
}

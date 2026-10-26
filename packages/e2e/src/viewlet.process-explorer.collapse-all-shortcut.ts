import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.collapse-all-shortcut'
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
    await Command.execute('ProcessExplorer.handleClickAt', 1)
    await Command.execute('ProcessExplorer.handleClickAt', 0)
    await expect(parent).toBeFocused()
    await KeyBoard.press(
      `${navigator.platform.startsWith('Mac') ? 'Meta' : 'Control'}+ArrowLeft`,
    )
    await expect(parent).toHaveAttribute('aria-expanded', 'false')
    await expect(child).toBeHidden()
  } finally {
    await Command.execute('ProcessExplorer.expandAll')
    await Command.execute('ProcessExplorer.setRootProcessId', -1)
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
    await Command.execute('ProcessExplorer.refresh')
  }
}

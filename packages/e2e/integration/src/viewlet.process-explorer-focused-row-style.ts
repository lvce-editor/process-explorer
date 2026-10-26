import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer-focused-row-style'

export const test: Test = async ({ Command, expect, KeyBoard, Locator }) => {
  await Command.execute('Developer.openProcessExplorer')
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)
  const table = Locator('.ProcessExplorerTable')
  const firstRow = Locator('.ProcessExplorerRow[data-index="0"]')
  const secondRow = Locator('.ProcessExplorerRow[data-index="1"]')

  try {
    await expect(table).toBeVisible()
    await expect(firstRow).toBeVisible()
    await expect(secondRow).toBeVisible()

    await Command.execute('ProcessExplorer.handleClickAt', 0)
    await expect(firstRow).toBeFocused()
    await expect(firstRow).toHaveCSS('outline-style', 'none')
    await expect(firstRow).toHaveAttribute('tabindex', '0')
    await expect(firstRow).toHaveClass(
      'ProcessExplorerRow ProcessExplorerRowFocused',
    )
    await expect(firstRow).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await expect(firstRow).toHaveAttribute('role', 'row')

    await KeyBoard.press('ArrowDown')
    await expect(secondRow).toBeFocused()
    await expect(secondRow).toHaveCSS('outline-style', 'none')
    await expect(secondRow).toHaveAttribute('tabindex', '0')
    await expect(firstRow).toHaveAttribute('tabindex', '-1')
    await expect(secondRow).toHaveClass(
      'ProcessExplorerRow ProcessExplorerRowFocused',
    )

    await KeyBoard.press('ArrowUp')
    await expect(firstRow).toBeFocused()
    await expect(firstRow).toHaveCSS('outline-style', 'none')

    await KeyBoard.press('Tab')
    await expect(firstRow).not.toBeFocused()
    await KeyBoard.press('Shift+Tab')
    await expect(firstRow).toBeFocused()
    await expect(firstRow).toHaveCSS('outline-style', 'none')
  } finally {
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
  }
}

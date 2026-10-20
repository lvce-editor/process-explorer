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

    // eslint-disable-next-line e2e/no-direct-click -- verify focus style after mouse focus
    await firstRow.click()
    await expect(firstRow).toBeFocused()
    await expect(firstRow).toHaveCSS('outline-style', 'none')

    await KeyBoard.press('ArrowDown')
    await expect(secondRow).toBeFocused()
    await expect(secondRow).toHaveCSS('outline-style', 'none')
  } finally {
    await Command.execute('ProcessExplorer.setUpdateInterval', 1000)
  }
}

import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.process-explorer.keyboard-navigation'

const defaultUpdateInterval = 1000

export const test: Test = async ({ Command, expect, KeyBoard, Locator }) => {
  // arrange
  await Command.execute('Developer.openProcessExplorer')
  await Command.execute('ProcessExplorer.setUpdateInterval', -1)
  const table = Locator('.ProcessExplorerTable')
  await expect(table).toBeVisible()
  const firstRow = Locator('.ProcessExplorerRow[data-index="0"]')
  const secondRow = Locator('.ProcessExplorerRow[data-index="1"]')

  try {
    await expect(firstRow).toBeVisible()
    await expect(secondRow).toBeVisible()

    // act
    // eslint-disable-next-line e2e/no-direct-click -- verifies keyboard navigation after focusing a row with the mouse
    await firstRow.click()
    await expect(firstRow).toHaveAttribute('tabindex', '0')
    await expect(firstRow).toBeFocused()
    await KeyBoard.press('ArrowDown')

    // assert
    const focusedSecondRow = Locator(
      '.ProcessExplorerRowFocused[data-index="1"]',
    )
    await expect(focusedSecondRow).toBeVisible()
    await expect(focusedSecondRow).toBeFocused()

    // act
    await KeyBoard.press('ArrowUp')

    // assert
    const focusedFirstRow = Locator(
      '.ProcessExplorerRowFocused[data-index="0"]',
    )
    await expect(focusedFirstRow).toBeVisible()
    await expect(focusedFirstRow).toBeFocused()

    // act
    await KeyBoard.press('ArrowDown')

    // assert
    await expect(focusedSecondRow).toBeVisible()
    await expect(focusedSecondRow).toBeFocused()

    // act
    await KeyBoard.press('ArrowUp')

    // assert
    await expect(focusedFirstRow).toBeVisible()
    await expect(focusedFirstRow).toBeFocused()
  } finally {
    await Command.execute(
      'ProcessExplorer.setUpdateInterval',
      defaultUpdateInterval,
    )
  }
}

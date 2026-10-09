import { expect, test } from '@jest/globals'
import { getCss } from '../src/parts/GetCss/GetCss.ts'

test('getCss - creates an indent class for every depth', () => {
  expect(getCss([1, 2, 4]))
    .toBe(`.ProcessExplorerNameCell.ProcessExplorerIndent-1 {
  padding-left: 0ch;
}
.ProcessExplorerNameCell.ProcessExplorerIndent-2 {
  padding-left: 1.5ch;
}
.ProcessExplorerNameCell.ProcessExplorerIndent-4 {
  padding-left: 4.5ch;
}`)
})

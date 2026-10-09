const getIndentRule = (depth: number): string => {
  const paddingLeft = Math.max(0, depth - 1) * 1.5
  return `.ProcessExplorerNameCell.ProcessExplorerIndent-${depth} {
  padding-left: ${paddingLeft}ch;
}`
}

export const getCss = (depths: readonly number[]): string => {
  return depths.map(getIndentRule).join('\n')
}

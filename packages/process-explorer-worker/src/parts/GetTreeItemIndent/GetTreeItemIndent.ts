const defaultIndent = 12

export const getTreeItemIndent = (depth: number): number => {
  return depth * defaultIndent
}

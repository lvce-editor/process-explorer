import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

export const getTreeItemClassName = (
  isSelected: boolean,
  isFocused: boolean,
  isDropping: boolean,
  useChevrons: boolean,
  indent: number,
  decoration: string,
): string => {
  let className = ClassNames.TreeItem
  className = MergeClassNames.mergeClassNames(className, `Indent-${indent}`)
  if (isSelected || isFocused) {
    className = MergeClassNames.mergeClassNames(className, ClassNames.TreeItemActive)
  }
  if (isDropping) {
    className = MergeClassNames.mergeClassNames(className, 'DropTarget')
  }
  if (decoration) {
    className = MergeClassNames.mergeClassNames(className, `decoration-${decoration}`)
  }
  return className
}

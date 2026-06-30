import * as DirentType from '../DirentType/DirentType.ts'
import * as ExpandedType from '../ExpandedType/ExpandedType.ts'

export const getExpandedType = (type: number): number => {
  switch (type) {
    case DirentType.Directory:
      return ExpandedType.Collapsed
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return ExpandedType.Expanded
    default:
      return ExpandedType.None
  }
}

import * as ChevronType from '../ChevronType/ChevronType.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const getChevronType = (type: number, useChevrons: boolean): number => {
  if (!useChevrons) {
    return ChevronType.None
  }
  switch (type) {
    case DirentType.Directory:
      return ChevronType.Right
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return ChevronType.Down
    default:
      return ChevronType.None
  }
}

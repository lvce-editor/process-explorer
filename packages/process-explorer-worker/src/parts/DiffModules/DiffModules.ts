import * as DiffFocus from '../DiffFocus/DiffFocus.ts'
import * as DiffItems from '../DiffItems/DiffItems.ts'
import * as DiffType from '../DiffType/DiffType.ts'

export const modules = [DiffItems.isEqual, DiffFocus.isEqual, DiffFocus.isEqual]

export const numbers = [
  DiffType.RenderIncremental,
  DiffType.RenderFocus,
  DiffType.RenderFocusContext,
]

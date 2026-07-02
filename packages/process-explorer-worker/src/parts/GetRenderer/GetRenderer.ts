import type { Renderer } from '../Renderer/Renderer.ts'
import * as DiffType from '../DiffType/DiffType.ts'
import * as RenderFocus from '../RenderFocus/RenderFocus.ts'
import * as RenderFocusContext from '../RenderFocusContext/RenderFocusContext.ts'
import { renderIncremental } from '../RenderIncremental/RenderIncremental.ts'
import * as RenderItems from '../RenderItems/RenderItems.ts'

export const getRenderer = (diffType: number): Renderer => {
  switch (diffType) {
    case DiffType.RenderFocus:
      return RenderFocus.renderFocus
    case DiffType.RenderFocusContext:
      return RenderFocusContext.renderFocusContext
    case DiffType.RenderIncremental:
      return renderIncremental
    case DiffType.RenderItems:
      return RenderItems.renderItems
    default:
      throw new Error(`unknown renderer ${diffType}`)
  }
}

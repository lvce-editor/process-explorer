import { type VirtualDomNode, text } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getErrorMessageDom = (errorMessage: string): readonly VirtualDomNode[] => {
  if (!errorMessage) {
    return []
  }

  return [
    {
      childCount: 1,
      className: MergeClassNames.mergeClassNames(ClassNames.ExplorerErrorMessage),
      type: VirtualDomElements.Div,
    },
    text(errorMessage),
  ]
}

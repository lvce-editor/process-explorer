import { text } from '@lvce-editor/virtual-dom-worker'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as InputName from '../InputName/InputName.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getParentNode = (childCount: number): VirtualDomNode => {
  return {
    childCount,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  }
}

export const getLoadErrorVirtualDom = (
  loadErrorMessage: string,
  isWide: boolean,
  showOpenAnotherFolderButton: boolean,
): readonly VirtualDomNode[] => {
  const childCount = showOpenAnotherFolderButton ? 2 : 1
  const errorDom: readonly VirtualDomNode[] = [
    {
      childCount,
      className: ClassNames.Welcome,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 1,
      className: ClassNames.WelcomeMessage,
      type: VirtualDomElements.P,
    },
    text(loadErrorMessage),
  ]
  const buttonDom = showOpenAnotherFolderButton
    ? [
        {
          childCount: 1,
          className: MergeClassNames.mergeClassNames(
            ClassNames.Button,
            ClassNames.ButtonPrimary,
            isWide ? ClassNames.ButtonWide : ClassNames.ButtonNarrow,
          ),
          name: InputName.OpenFolder,
          onClick: DomEventListenerFunctions.HandleClickOpenFolder,
          type: VirtualDomElements.Button,
        },
        text(ExplorerStrings.openAnotherFolder()),
      ]
    : []
  const parentNode = getParentNode(1)
  return [parentNode, ...errorDom, ...buttonDom]
}

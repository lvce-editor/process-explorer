import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import { getInputClassName } from '../GetInputClassName/GetInputClassName.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getInputDom = (isEditing: boolean, hasEditingError: boolean): readonly VirtualDomNode[] => {
  if (!isEditing) {
    return []
  }
  const ariaLabel = ExplorerStrings.typeAFileName()
  return [
    {
      ariaLabel: ariaLabel,
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: getInputClassName(hasEditingError),
      id: 'ExplorerInput',
      name: InputName.ExplorerInput,
      onBlur: DomEventListenerFunctions.HandleInputBlur,
      onClick: DomEventListenerFunctions.HandleInputClick,
      onInput: DomEventListenerFunctions.HandleEditingInput,
      spellcheck: 'false',
      type: VirtualDomElements.Input,
    },
  ]
}

import { expect, test } from '@jest/globals'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { getInputDom } from '../src/parts/GetInputDom/GetInputDom.ts'
import * as InputName from '../src/parts/InputName/InputName.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getInputDom - without error', () => {
  const result = getInputDom(true, false)
  expect(result).toEqual([
    {
      ariaLabel: 'Type file name. Press Enter to confirm or Escape to cancel.',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: `ExplorerInputBox`,
      id: 'ExplorerInput',
      name: InputName.ExplorerInput,
      onBlur: DomEventListenerFunctions.HandleInputBlur,
      onClick: DomEventListenerFunctions.HandleInputClick,
      onInput: DomEventListenerFunctions.HandleEditingInput,
      spellcheck: 'false',
      type: VirtualDomElements.Input,
    },
  ])
})

test('getInputDom - with error', () => {
  const result = getInputDom(true, true)
  expect(result).toEqual([
    {
      ariaLabel: 'Type file name. Press Enter to confirm or Escape to cancel.',
      autocapitalize: 'off',
      autocomplete: 'off',
      autocorrect: 'off',
      childCount: 0,
      className: expect.stringContaining(ClassNames.InputBox),
      id: 'ExplorerInput',
      name: InputName.ExplorerInput,
      onBlur: DomEventListenerFunctions.HandleInputBlur,
      onClick: DomEventListenerFunctions.HandleInputClick,
      onInput: DomEventListenerFunctions.HandleEditingInput,
      spellcheck: 'false',
      type: VirtualDomElements.Input,
    },
  ])
})

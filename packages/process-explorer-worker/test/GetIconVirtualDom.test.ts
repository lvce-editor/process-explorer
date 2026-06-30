import { expect, test } from '@jest/globals'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as GetIconVirtualDom from '../src/parts/GetIconVirtualDom/GetIconVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getIconVirtualDom - with icon', () => {
  expect(GetIconVirtualDom.getIconVirtualDom('File')).toEqual({
    childCount: 0,
    className: 'MaskIcon MaskIconFile',
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  })
})

test('getIconVirtualDom - with custom element type', () => {
  expect(GetIconVirtualDom.getIconVirtualDom('Folder', VirtualDomElements.Div)).toEqual({
    childCount: 0,
    className: 'MaskIcon MaskIconFolder',
    role: AriaRoles.None,
    type: VirtualDomElements.Div,
  })
})

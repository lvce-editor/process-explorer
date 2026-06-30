import { expect, test } from '@jest/globals'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import * as GetFileIconVirtualDom from '../src/parts/GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getFileIconVirtualDom - with icon path', () => {
  expect(GetFileIconVirtualDom.getFileIconVirtualDom('/icons/file.svg')).toEqual({
    childCount: 0,
    className: ClassNames.FileIcon,
    role: AriaRoles.None,
    src: '/icons/file.svg',
    type: VirtualDomElements.Img,
  })
})

test('getFileIconVirtualDom - empty icon path', () => {
  expect(GetFileIconVirtualDom.getFileIconVirtualDom('')).toEqual({
    childCount: 0,
    className: ClassNames.FileIcon,
    role: AriaRoles.None,
    src: '',
    type: VirtualDomElements.Img,
  })
})

import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getFileIconVirtualDom = (icon: string): VirtualDomNode => {
  return {
    childCount: 0,
    className: ClassNames.FileIcon,
    role: AriaRoles.None,
    src: icon,
    type: VirtualDomElements.Img,
  }
}

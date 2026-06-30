import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ContextMenuProps } from '../ContextMenuProps/ContextMenuProps.ts'

export const show2 = async <T extends ContextMenuProps>(
  uid: number,
  menuId: ContextMenuProps['menuId'],
  x: number,
  y: number,
  args: ContextMenuProps,
): Promise<void> => {
  await RendererWorker.showContextMenu2(uid, menuId, x, y, args)
}

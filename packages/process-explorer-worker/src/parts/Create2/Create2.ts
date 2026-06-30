import { create } from '../Create/Create.ts'

// TODO parentUid might ot be needed
export const create2 = (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  args: any,
  parentUid: any,
  platform: number = 0,
  assetDir: string = '',
): void => {
  return create(uid, uri, x, y, width, height, args, parentUid, platform, assetDir)
}

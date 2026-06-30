import type { Tree } from '../Tree/Tree.ts'

export const mergeTrees = (a: Tree, b: Tree): Tree => {
  return {
    ...a,
    ...b,
  }
}

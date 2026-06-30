import type { DropHandler } from '../DropHandler/DropHandler.ts'
import * as HandleDropIndex from '../HandleDropIndex/HandleDropIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'

export const getDropHandler = (index: number): DropHandler => {
  switch (index) {
    case -1:
      return HandleDropRoot.handleDropRoot
    default:
      return HandleDropIndex.handleDropIndex
  }
}

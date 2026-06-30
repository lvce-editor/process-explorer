import type { PasteHandler } from '../PasteHandler/PasteHandler.ts'
import * as HandlePasteCopy from '../HandlePasteCopy/HandlePasteCopy.ts'
import * as HandlePasteCut from '../HandlePasteCut/HandlePasteCut.ts'
import * as HandlePasteNone from '../HandlePasteNone/HandlePasteNone.ts'
import * as NativeFileTypes from '../NativeFileTypes/NativeFileTypes.ts'

export const getPasteHandler = (type: string): PasteHandler => {
  switch (type) {
    case NativeFileTypes.Copy:
      return HandlePasteCopy.handlePasteCopy
    case NativeFileTypes.Cut:
      return HandlePasteCut.handlePasteCut
    case NativeFileTypes.None:
      return HandlePasteNone.handlePasteNone
    default:
      throw new Error(`unexpected native paste type: ${type}`)
  }
}

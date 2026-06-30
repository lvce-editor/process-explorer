import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const confirmPaste = async (): Promise<boolean> => {
  const result = await RendererWorker.confirm(ExplorerStrings.pasteConfirmation())
  return result
}

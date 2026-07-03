import { ErrorWorker } from '@lvce-editor/rpc-registry'

export interface PreparedError {
  readonly codeFrame: string | undefined
  readonly message: string | undefined
  readonly stack: string | undefined
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

export const prepareError = async (error: unknown): Promise<PreparedError> => {
  try {
    return await ErrorWorker.prepare(error)
  } catch {
    return {
      codeFrame: undefined,
      message: getErrorMessage(error),
      stack: undefined,
    }
  }
}

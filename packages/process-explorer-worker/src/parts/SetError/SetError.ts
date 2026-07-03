import type { ProcessExplorerState } from '../ProcessExplorerState/ProcessExplorerState.ts'
import * as PrepareError from '../PrepareError/PrepareError.ts'

interface RawError {
  readonly code?: string
  readonly message?: string
  readonly stack?: string
}

const isRawError = (value: unknown): value is RawError => {
  return Boolean(value && typeof value === 'object')
}

const getRawMessage = (rawError: RawError): string => {
  if (typeof rawError.message === 'string') {
    return rawError.message
  }
  return String(rawError.message)
}

const toError = (rawError: unknown): unknown => {
  if (rawError instanceof Error) {
    return rawError
  }
  if (!isRawError(rawError)) {
    return new Error(String(rawError))
  }
  if (typeof rawError.stack === 'string') {
    return {
      code: rawError.code,
      message: getRawMessage(rawError),
      stack: rawError.stack,
    }
  }
  const error = new Error(getRawMessage(rawError))
  if (typeof rawError.code === 'string') {
    Object.assign(error, {
      code: rawError.code,
    })
  }
  return error
}

export const setError = async (
  state: ProcessExplorerState,
  rawError: unknown,
): Promise<ProcessExplorerState> => {
  const error = toError(rawError)
  const prettyError = await PrepareError.prepareError(error)
  return {
    ...state,
    errorCodeFrame: prettyError.codeFrame || '',
    errorMessage: prettyError.message || PrepareError.getErrorMessage(error),
    errorStack: prettyError.stack || '',
    initial: false,
  }
}

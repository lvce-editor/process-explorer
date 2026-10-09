import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.ts'

export const isMissingProcessError = (error: unknown): boolean => {
  return IsEnoentError.isEnoentError(error) || IsEsrchError.isEsrchError(error)
}

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.ts'

export const getContent = async (pid: number): Promise<string> => {
  try {
    const filePath = join('/proc', String(pid), 'statm')
    const content = await readFile(filePath, EncodingType.Utf8)
    return content
  } catch (error) {
    if (
      IsEnoentError.isEnoentError(error) ||
      IsEsrchError.isEsrchError(error)
    ) {
      return ''
    }
    throw error
  }
}

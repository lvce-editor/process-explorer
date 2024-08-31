import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import * as Assert from '../Assert/Assert.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as IsEnoentError from '../IsEnoentError/IsEnoentError.ts'
import * as IsEsrchError from '../IsEsrchError/IsEsrchError.ts'
import * as IsMacos from '../IsMacos/IsMacos.ts'
import * as ParseMemory from '../ParseMemory/ParseMemory.ts'
import { VError } from '../VError/VError.ts'

const getContent = async (pid) => {
  try {
    const filePath = join('/proc', `${pid}`, 'statm')
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

export const getAccurateMemoryUsage = async (pid) => {
  try {
    Assert.number(pid)
    if (IsMacos.isMacOs) {
      return 0
    }
    const content = await getContent(pid)
    if (!content) {
      return -1
    }
    const memory = ParseMemory.parseMemory(content)
    return memory
  } catch (error) {
    throw new VError(error, 'Failed to get accurate memory usage')
  }
}

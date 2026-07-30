import * as Assert from '../Assert/Assert.ts'
import * as GetProcStatmContent from '../GetProcStatmContent/GetProcStatmContent.ts'
import * as ParseMemory from '../ParseMemory/ParseMemory.ts'
import { VError } from '../VError/VError.ts'

export const getAccurateMemoryUsage = async (pid: number): Promise<number> => {
  try {
    Assert.number(pid)
    const content = await GetProcStatmContent.getContent(pid)
    if (!content) {
      return -1
    }
    const memory = ParseMemory.parseMemory(content)
    return memory
  } catch (error) {
    throw new VError(error, 'Failed to get accurate memory usage')
  }
}

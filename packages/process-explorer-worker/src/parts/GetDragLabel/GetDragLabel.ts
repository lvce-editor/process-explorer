import { getBaseName } from '../Path/Path.ts'

export const getDragLabel = (urls: readonly string[]): string => {
  if (urls.length === 1) {
    return getBaseName('/', urls[0])
  }
  return String(urls.length)
}

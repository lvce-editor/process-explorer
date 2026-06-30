import { IconThemeWorker } from '@lvce-editor/rpc-registry'
import type { IconRequest } from '../IconRequest/IconRequest.ts'
import { toSimpleIconRequest } from '../ToSimpleIconRequest/ToSimpleIconRequest.ts'

export const requestFileIcons = async (requests: readonly IconRequest[]): Promise<readonly string[]> => {
  if (requests.length === 0) {
    return []
  }
  const simpleRequests = requests.map(toSimpleIconRequest)
  const icons = await IconThemeWorker.getIcons(simpleRequests)
  return icons
}

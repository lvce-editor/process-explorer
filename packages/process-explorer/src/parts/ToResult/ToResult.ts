import type { CompleteProcessInfo } from '../CompleteProcessInfo/CompleteProcessInfo.ts'
import type { ProcessItem } from '../ProcessItem/ProcessItem.ts'
import * as ToResultItem from '../ToResultItem/ToResultItem.ts'

export const toResult = (
  completeProcessList: ReadonlyArray<Readonly<CompleteProcessInfo>>,
  rootPid: number,
  pidMap: Readonly<Record<number, string>>,
): readonly ProcessItem[] => {
  const results = Array.from(completeProcessList, (item) =>
    ToResultItem.toResultItem(item, rootPid, pidMap),
  )
  return results
}

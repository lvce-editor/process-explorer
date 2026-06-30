import * as GetNumberOfVisibleItems from '../GetNumberOfVisibleItems/GetNumberOfVisibleItems.ts'

export const getExplorerMaxLineY = (minLineY: number, height: number, itemHeight: number, direntsLength: number): number => {
  const maxLineY = minLineY + Math.min(GetNumberOfVisibleItems.getNumberOfVisibleItems(height, itemHeight), direntsLength)
  return maxLineY
}

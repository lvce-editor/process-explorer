import type { ScrollIntoResult } from '../ScrollIntoResult/ScrollIntoResult.ts'

export const scrollInto = (index: number, minLineY: number, maxLineY: number): ScrollIntoResult => {
  const diff = maxLineY - minLineY
  const smallerHalf = Math.floor(diff / 2)
  const largerHalf = diff - smallerHalf
  if (index < minLineY) {
    return {
      newMaxLineY: index + largerHalf,
      newMinLineY: index - smallerHalf,
    }
  }
  if (index >= maxLineY) {
    return {
      newMaxLineY: index + largerHalf,
      newMinLineY: index - smallerHalf,
    }
  }
  return {
    newMaxLineY: maxLineY,
    newMinLineY: minLineY,
  }
}

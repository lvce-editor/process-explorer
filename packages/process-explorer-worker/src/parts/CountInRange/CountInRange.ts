export const countInRange = (start: number, end: number): readonly number[] => {
  const items: number[] = []
  for (let i = start; i <= end; i++) {
    items.push(i)
  }
  return items
}

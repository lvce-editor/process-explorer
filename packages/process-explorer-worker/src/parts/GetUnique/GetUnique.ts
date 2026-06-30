export const getUnique = (items: readonly number[]): readonly number[] => {
  const seens: number[] = []
  for (const item of items) {
    if (!seens.includes(item)) {
      seens.push(item)
    }
  }
  return seens
}

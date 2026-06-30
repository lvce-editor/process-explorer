export const lastIndex = (array: readonly any[]): number => {
  return array.length - 1
}

export const fromAsync = async (asyncIterable: any): Promise<readonly any[]> => {
  return Array.fromAsync(asyncIterable)
}

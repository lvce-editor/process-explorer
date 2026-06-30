export const filterByFocusWord = (items: readonly string[], focusedIndex: number, focusWord: string): number => {
  if (items.length === 0) {
    return -1
  }

  const matches: number[] = []
  for (let i = 0; i < items.length; i++) {
    if (items[i].toLowerCase().includes(focusWord)) {
      matches.push(i)
    }
  }

  if (matches.length === 0) {
    return -1
  }

  // Find the next match after the current focus
  let nextIndex = matches.findIndex((index) => index > focusedIndex)
  if (nextIndex === -1) {
    // If no match found after current focus, wrap around to the first match
    nextIndex = 0
  }

  return matches[nextIndex]
}

const RE_CHARACTERS = /^[a-zA-Z.-]+$/
const RE_LEADING_DIGITS = /^\d+/
const RE_LEADING_ZEROES = /^0+/

const compareLeadingDigits = (a: string, b: string): number => {
  const normalizedA = a.replace(RE_LEADING_ZEROES, '') || '0'
  const normalizedB = b.replace(RE_LEADING_ZEROES, '') || '0'
  if (normalizedA.length !== normalizedB.length) {
    return normalizedA.length - normalizedB.length
  }
  if (normalizedA !== normalizedB) {
    return normalizedA < normalizedB ? -1 : 1
  }
  return a.length - b.length
}

const compareLeadingNumbers = (a: string, b: string): number => {
  const leadingDigitsA = a.match(RE_LEADING_DIGITS)?.[0]
  const leadingDigitsB = b.match(RE_LEADING_DIGITS)?.[0]
  if (leadingDigitsA && leadingDigitsB) {
    return compareLeadingDigits(leadingDigitsA, leadingDigitsB)
  }
  return 0
}

export const compareStringNumeric = (a: string, b: string): number => {
  if (RE_CHARACTERS.test(a) && RE_CHARACTERS.test(b)) {
    return a < b ? -1 : 1
  }
  return compareLeadingNumbers(a, b) || a.localeCompare(b, 'en', { numeric: true })
}

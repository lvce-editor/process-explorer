import { expect, test } from '@jest/globals'
import * as GetUrlName from '../src/parts/GetUrlName/GetUrlName.ts'

test('uses a parsed hostname when a URL has no path', () => {
  expect(GetUrlName.getUrlName('https://example.test/')).toBe('example.test')
})

test('preserves an unparseable URL when it has no path segment', () => {
  expect(GetUrlName.getUrlName('/?view=workers')).toBe('/?view=workers')
})

test('preserves a file URL without a hostname or path', () => {
  expect(GetUrlName.getUrlName('file:///')).toBe('file:///')
})

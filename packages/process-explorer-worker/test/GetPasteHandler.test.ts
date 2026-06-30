import { expect, test } from '@jest/globals'
import * as GetPasteHandler from '../src/parts/GetPasteHandler/GetPasteHandler.ts'
import * as HandlePasteCopy from '../src/parts/HandlePasteCopy/HandlePasteCopy.ts'
import * as HandlePasteCut from '../src/parts/HandlePasteCut/HandlePasteCut.ts'
import * as HandlePasteNone from '../src/parts/HandlePasteNone/HandlePasteNone.ts'
import * as NativeFileTypes from '../src/parts/NativeFileTypes/NativeFileTypes.ts'

test('getPasteHandler - none', () => {
  expect(GetPasteHandler.getPasteHandler(NativeFileTypes.None)).toBe(HandlePasteNone.handlePasteNone)
})

test('getPasteHandler - copy', () => {
  expect(GetPasteHandler.getPasteHandler(NativeFileTypes.Copy)).toBe(HandlePasteCopy.handlePasteCopy)
})

test('getPasteHandler - cut', () => {
  expect(GetPasteHandler.getPasteHandler(NativeFileTypes.Cut)).toBe(HandlePasteCut.handlePasteCut)
})

test('getPasteHandler - invalid type', () => {
  expect(() => GetPasteHandler.getPasteHandler('invalid')).toThrow('unexpected native paste type: invalid')
})

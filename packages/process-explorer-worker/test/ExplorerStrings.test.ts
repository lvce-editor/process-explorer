import { expect, test } from '@jest/globals'
import * as ExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'

test('newFile', () => {
  expect(ExplorerStrings.newFile()).toBe('New File...')
})

test('newFolder', () => {
  expect(ExplorerStrings.newFolder()).toBe('New Folder...')
})

test('openContainingFolder', () => {
  expect(ExplorerStrings.openContainingFolder()).toBe('Open Containing Folder')
})

test('openInIntegratedTerminal', () => {
  expect(ExplorerStrings.openInIntegratedTerminal()).toBe('Open in integrated Terminal')
})

test('cut', () => {
  expect(ExplorerStrings.cut()).toBe('Cut')
})

test('copy', () => {
  expect(ExplorerStrings.copy()).toBe('Copy')
})

test('paste', () => {
  expect(ExplorerStrings.paste()).toBe('Paste')
})

test('copyPath', () => {
  expect(ExplorerStrings.copyPath()).toBe('Copy Path')
})

test('copyRelativePath', () => {
  expect(ExplorerStrings.copyRelativePath()).toBe('Copy Relative Path')
})

test('rename', () => {
  expect(ExplorerStrings.rename()).toBe('Rename')
})

test('deleteItem', () => {
  expect(ExplorerStrings.deleteItem()).toBe('Delete')
})

test('refresh', () => {
  expect(ExplorerStrings.refresh()).toBe('Refresh Explorer')
})

test('collapseAll', () => {
  expect(ExplorerStrings.collapseAll()).toBe('Collapse All Folders in Explorer')
})

test('explorer', () => {
  expect(ExplorerStrings.explorer()).toBe('Explorer')
})

test('filesExplorer', () => {
  expect(ExplorerStrings.filesExplorer()).toBe('Files Explorer')
})

test('youHaveNotYetOpenedAFolder', () => {
  expect(ExplorerStrings.youHaveNotYetOpenedAFolder()).toBe('You have not yet opened a folder.')
})

test('openFolder', () => {
  expect(ExplorerStrings.openFolder()).toBe('Open folder')
})

test('openAnotherFolder', () => {
  expect(ExplorerStrings.openAnotherFolder()).toBe('Open another folder')
})

test('noFolderOpen', () => {
  expect(ExplorerStrings.noFolderOpen()).toBe('No Folder Open')
})

test('fileOrFolderNameMustBeProvided', () => {
  expect(ExplorerStrings.fileOrFolderNameMustBeProvided()).toBe('A file or folder name must be provided.')
})

test('typeAFileName', () => {
  expect(ExplorerStrings.typeAFileName()).toBe('Type file name. Press Enter to confirm or Escape to cancel.')
})

test('fileNameCannotStartWithSlash', () => {
  expect(ExplorerStrings.fileNameCannotStartWithSlash()).toBe('A file or folder name cannot start with a slash.')
})

test('fileOrFolderAlreadyExists', () => {
  expect(ExplorerStrings.fileOrFolderAlreadyExists('test-file.txt')).toBe(
    'A file or folder **test-file.txt** already exists at this location. Please choose a different name.',
  )
})

test('theNameIsNotValid', () => {
  expect(ExplorerStrings.theNameIsNotValid()).toBe('The name **{0}** is not valid as a file or folder name. Please choose a different name.')
})

test('leadingOrTrailingWhitespaceDetected', () => {
  expect(ExplorerStrings.leadingOrTrailingWhitespaceDetected()).toBe('Leading or trailing whitespace detected in file or folder name.')
})

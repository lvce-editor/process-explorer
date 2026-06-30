import { expect, test } from '@jest/globals'
import * as DomEventListenerFunctions from '../src/parts/DomEventListenerFunctions/DomEventListenerFunctions.ts'
import { dropTargetFull } from '../src/parts/DropTargetFull/DropTargetFull.ts'
import * as GetExplorerWelcomeVirtualDom from '../src/parts/GetExplorerWelcomeVirtualDom/GetExplorerWelcomeVirtualDom.ts'

test('getExplorerWelcomeVirtualDom - wide', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(true, [])).toEqual([
    {
      childCount: 1,
      className: 'Viewlet Explorer',
      onContextMenu: DomEventListenerFunctions.HandleContextMenuWelcome,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      tabIndex: 0,
      type: 4,
    },
    {
      childCount: 2,
      className: 'Welcome',
      type: 4,
    },
    {
      childCount: 1,
      className: 'WelcomeMessage',
      type: 50,
    },
    {
      childCount: 0,
      text: 'You have not yet opened a folder.',
      type: 12,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary ButtonWide',
      name: 'OpenFolder',
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: 1,
    },
    {
      childCount: 0,
      text: 'Open folder',
      type: 12,
    },
  ])
})

test('getExplorerWelcomeVirtualDom - narrow', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(false, [])).toEqual([
    {
      childCount: 1,
      className: 'Viewlet Explorer',
      onContextMenu: DomEventListenerFunctions.HandleContextMenuWelcome,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      tabIndex: 0,
      type: 4,
    },
    {
      childCount: 2,
      className: 'Welcome',
      type: 4,
    },
    {
      childCount: 1,
      className: 'WelcomeMessage',
      type: 50,
    },
    {
      childCount: 0,
      text: 'You have not yet opened a folder.',
      type: 12,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary ButtonNarrow',
      name: 'OpenFolder',
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: 1,
    },
    {
      childCount: 0,
      text: 'Open folder',
      type: 12,
    },
  ])
})

test('getExplorerWelcomeVirtualDom - drop target', () => {
  expect(GetExplorerWelcomeVirtualDom.getExplorerWelcomeVirtualDom(true, dropTargetFull)).toEqual([
    {
      childCount: 1,
      className: 'Viewlet Explorer DropTarget',
      onContextMenu: DomEventListenerFunctions.HandleContextMenuWelcome,
      onDragLeave: DomEventListenerFunctions.HandleDragLeave,
      onDragOver: DomEventListenerFunctions.HandleDragOver,
      onDrop: DomEventListenerFunctions.HandleDrop,
      tabIndex: 0,
      type: 4,
    },
    {
      childCount: 2,
      className: 'Welcome',
      type: 4,
    },
    {
      childCount: 1,
      className: 'WelcomeMessage',
      type: 50,
    },
    {
      childCount: 0,
      text: 'You have not yet opened a folder.',
      type: 12,
    },
    {
      childCount: 1,
      className: 'Button ButtonPrimary ButtonWide',
      name: 'OpenFolder',
      onClick: DomEventListenerFunctions.HandleClickOpenFolder,
      type: 1,
    },
    {
      childCount: 0,
      text: 'Open folder',
      type: 12,
    },
  ])
})

import { expect, test } from '@jest/globals'
import { getUniqueIndents } from '../src/parts/GetUniqueIndents/GetUniqueIndents.ts'

test('getUniqueIndents - sorts and deduplicates depths', () => {
  expect(
    getUniqueIndents(
      [
        {
          cmd: '',
          depth: 3,
          flags: 0,
          memory: 0,
          name: '',
          parentTreeId: 0,
          pid: 1,
          ppid: 0,
          source: 'local' as const,
          synthetic: false,
          treeId: 1,
        },
        {
          cmd: '',
          depth: 1,
          flags: 0,
          memory: 0,
          name: '',
          parentTreeId: 0,
          pid: 2,
          ppid: 0,
          source: 'local' as const,
          synthetic: false,
          treeId: 2,
        },
        {
          cmd: '',
          depth: 3,
          flags: 0,
          memory: 0,
          name: '',
          parentTreeId: 0,
          pid: 3,
          ppid: 0,
          source: 'local' as const,
          synthetic: false,
          treeId: 3,
        },
        {
          cmd: '',
          depth: 2,
          flags: 0,
          memory: 0,
          name: '',
          parentTreeId: 0,
          pid: 4,
          ppid: 0,
          source: 'local' as const,
          synthetic: false,
          treeId: 4,
        },
      ],
      [],
    ),
  ).toEqual([1, 2, 3])
})

test('getUniqueIndents - reuses previous indents when depths are unchanged', () => {
  const previous = [1, 2]
  const result = getUniqueIndents(
    [
      {
        cmd: '',
        depth: 2,
        flags: 0,
        memory: 0,
        name: '',
        parentTreeId: 0,
        pid: 1,
        ppid: 0,
        source: 'local' as const,
        synthetic: false,
        treeId: 1,
      },
      {
        cmd: '',
        depth: 1,
        flags: 0,
        memory: 0,
        name: '',
        parentTreeId: 0,
        pid: 2,
        ppid: 0,
        source: 'local' as const,
        synthetic: false,
        treeId: 2,
      },
      {
        cmd: '',
        depth: 2,
        flags: 0,
        memory: 0,
        name: '',
        parentTreeId: 0,
        pid: 3,
        ppid: 0,
        source: 'local' as const,
        synthetic: false,
        treeId: 3,
      },
    ],
    previous,
  )

  expect(result).toBe(previous)
})

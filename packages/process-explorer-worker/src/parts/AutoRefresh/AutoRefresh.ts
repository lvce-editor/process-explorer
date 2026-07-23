import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ProcessExplorerStates from '../ProcessExplorerStates/ProcessExplorerStates.ts'
import * as ProcessExplorerUpdateInterval from '../ProcessExplorerUpdateInterval/ProcessExplorerUpdateInterval.ts'

const intervals = new Map<number, ReturnType<typeof setInterval>>()
const pending = new Set<number>()

export const dispose = (uid: number): void => {
  const interval = intervals.get(uid)
  if (interval) {
    clearInterval(interval)
    intervals.delete(uid)
  }
  pending.delete(uid)
}

export const clear = (): void => {
  for (const uid of intervals.keys()) {
    dispose(uid)
  }
}

const update = async (uid: number): Promise<void> => {
  if (!ProcessExplorerStates.getKeys().includes(uid)) {
    dispose(uid)
    return
  }
  if (pending.has(uid)) {
    return
  }
  pending.add(uid)
  try {
    await RendererWorker.invoke('ProcessExplorer.update')
  } catch (error) {
    console.error(error)
  } finally {
    pending.delete(uid)
  }
}

export const start = (
  uid: number,
  interval: number = ProcessExplorerUpdateInterval.processExplorerUpdateInterval,
): void => {
  if (interval <= 0 || intervals.has(uid)) {
    return
  }
  const intervalId = setInterval(() => {
    void update(uid)
  }, interval)
  intervals.set(uid, intervalId)
}

export const restart = (uid: number, interval: number): void => {
  dispose(uid)
  start(uid, interval)
}

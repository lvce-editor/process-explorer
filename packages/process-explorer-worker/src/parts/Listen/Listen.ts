import { initializeRendererWorker } from '../InitializeRendererWorker/initializeRendereWorker.ts'

export const listen = async (): Promise<void> => {
  await Promise.all([initializeRendererWorker()])
}

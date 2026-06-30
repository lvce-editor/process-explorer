declare module 'electron' {
  export interface MessagePortMain {
    close(): void
    postMessage(message: unknown, transfer?: readonly unknown[]): void
    start(): void
  }
}

declare namespace Electron {
  interface MessagePortMain {
    close(): void
    postMessage(message: unknown, transfer?: readonly unknown[]): void
    start(): void
  }
}

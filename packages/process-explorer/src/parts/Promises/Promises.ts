export const withResolvers = <T>(): PromiseWithResolvers<T> => {
  return Promise.withResolvers<T>()
}

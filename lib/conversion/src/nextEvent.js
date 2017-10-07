/* @flow */
export default function<S, T>(
  eventName: S,
  eventEmitter: {
    once(S, (T) => void): mixed
  }
): Promise<T> {
  return new Promise(resolve => {
    eventEmitter.once(eventName, data => {
      resolve(data)
    })
  })
}

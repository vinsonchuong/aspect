/* @flow */
import { nextEvent } from 'conversion'

export default async function<S>(
  eventName: S,
  eventEmitter: {
    once(S, (mixed) => void): void
  }
): Promise<void> {
  throw await nextEvent(eventName, eventEmitter)
}

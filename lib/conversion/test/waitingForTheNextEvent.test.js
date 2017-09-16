/* @flow */
import test from 'test'
import { EventEmitter } from 'events'
import { nextEvent } from 'conversion'

test('waiting for the next event', async t => {
  const eventEmitter = new EventEmitter()
  setTimeout(() => {
    eventEmitter.emit('action', { message: 'Hello' })
  }, 0)

  const event = await nextEvent('action', eventEmitter)
  t.deepEqual(event, { message: 'Hello' })
  t.is(eventEmitter.listenerCount('action'), 0)
})

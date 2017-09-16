/* @flow */
import test from 'test'
import { EventEmitter } from 'events'
import { nextErrorEvent } from 'conversion'

test('waiting for the next error event', async t => {
  const eventEmitter = new EventEmitter()
  setTimeout(() => {
    eventEmitter.emit('error', new Error('Error'))
  }, 0)

  await t.throws(nextErrorEvent('error', eventEmitter), 'Error')
  t.is(eventEmitter.listenerCount('action'), 0)
})

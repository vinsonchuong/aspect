/* @flow */
import test from 'test'
import { Readable } from 'stream'
import { streamToBuffer } from 'conversion'

test('reading a stream into a buffer', async t => {
  const data = ['H', 'e', 'l', 'l', 'o']
  const stream = new Readable({
    read() {
      if (data.length > 0) {
        this.push(data.shift())
      } else {
        this.push(null)
      }
    }
  })

  const buffer = await streamToBuffer(stream)

  t.true(buffer.includes('Hello'))
})

test('reading a stream with an error', async t => {
  const stream = new Readable({
    read() {
      this.emit('error', new Error('Error'))
    }
  })

  await t.throws(streamToBuffer(stream), 'Error')
})

test('reading a stream that is not readable', async t => {
  const stream = new Readable({
    read() {}
  })

  /* $FlowFixMe */
  stream.readable = false

  const buffer = await streamToBuffer(stream)
  t.is(buffer.byteLength, 0)
})

/* @flow */
import type { Readable } from 'stream'

export default function(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    if (!stream.readable) {
      resolve(Buffer.from(''))
    }

    const buffers = []
    stream.on('error', error => {
      reject(error)
    })
    stream.on('data', chunk => {
      buffers.push(chunk)
    })
    stream.on('end', () => {
      resolve(Buffer.concat(buffers))
    })
  })
}

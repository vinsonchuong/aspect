/* @flow */
import test from 'test'
import { parseUrl } from 'transport'

test('parsing URLs', t => {
  t.deepEqual(parseUrl('https://example.com/directory'), {
    protocol: 'https:',
    host: 'example.com',
    path: '/directory'
  })
})

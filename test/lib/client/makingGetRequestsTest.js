/* @flow */
import test from 'ava'
import { request } from 'aspect/src/lib/client'

test('making GET requests', async t => {
  const html = await request('http://example.com/')
  t.true(html.includes('Example Domain'))
})

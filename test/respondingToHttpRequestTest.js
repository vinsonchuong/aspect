/* @flow */
import test from 'ava'
import { URL } from 'url'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'

test('generating a static response to HTTP requests', async t => {
  const response = await respondToHttpRequest({
    method: 'GET',
    url: new URL('http://example.com/')
  })
  t.true(response.includes('<!doctype html>'))
})

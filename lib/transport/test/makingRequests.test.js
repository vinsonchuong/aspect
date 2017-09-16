/* @flow */
import test from 'test'
import { makeRequest } from 'transport'

test('making an HTTP/2 GET request to a reference server', async t => {
  const response = await makeRequest({
    method: 'GET',
    url: 'https://http2.akamai.com/demo',
    headers: {},
    body: Buffer.from('')
  })

  t.is(response.status, 200)
  t.is(response.headers['Content-Type'], 'text/html')
  t.true(response.body.includes('<html>'))
})

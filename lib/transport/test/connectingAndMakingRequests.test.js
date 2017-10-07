/* @flow */
import test from 'test'
import { connect, disconnect, sendRequest } from 'transport'

test('connecting to an HTTP2 server and making requests', async t => {
  const session = connect('http2.akamai.com')
  const response1 = await sendRequest(session, {
    method: 'GET',
    url: '/demo',
    headers: {},
    body: Buffer.from('')
  })
  const response2 = await sendRequest(session, {
    method: 'GET',
    url: '/demo',
    headers: {},
    body: Buffer.from('')
  })
  await disconnect(session)

  t.is(response1.status, 200)
  t.is(response1.headers['Content-Type'], 'text/html')
  t.true(response1.body.includes('<html>'))

  t.is(response2.status, 200)
  t.is(response2.headers['Content-Type'], 'text/html')
  t.true(response2.body.includes('<html>'))
})

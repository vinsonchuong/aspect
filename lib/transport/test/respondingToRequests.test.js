/* @flow */
import test from 'test'
import { useServer } from 'transport/test/helpers'
import { connect, disconnect, sendRequest, subscribe } from 'transport'

useServer()

test('responding to a request', async t => {
  const { server, hostname } = t.context

  subscribe(server, ({ method, url, headers, body }) => {
    t.is(method, 'GET')
    t.is(url, '/')
    t.is(headers['Accept'], 'application/json')
    t.is(body.byteLength, 0)

    return {
      status: 200,
      headers: {},
      body: Buffer.from('')
    }
  })

  const session = connect(`${hostname}:${server.port}`)
  const response = await sendRequest(session, {
    method: 'GET',
    url: '/',
    headers: {
      Accept: 'application/json'
    },
    body: Buffer.from('')
  })
  await disconnect(session)

  t.is(response.status, 200)
})

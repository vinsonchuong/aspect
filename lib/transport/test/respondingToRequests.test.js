/* @flow */
import test from 'test'
import { useServer } from 'transport/test/helpers'
import { makeRequest, subscribe } from 'transport'

useServer()

test('responding to a request', async t => {
  const { server } = t.context

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

  const response = await makeRequest({
    method: 'GET',
    url: `http://localhost:${server.port}/`,
    headers: {
      Accept: 'application/json'
    },
    body: Buffer.from('')
  })

  t.is(response.status, 200)
})

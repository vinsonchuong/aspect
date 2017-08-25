/* @flow */
import test from 'ava'
import { apply } from 'middleware'

function middleware(request, response) {
  return {
    ...response,
    headers: {
      'Content-Type': 'text/plain'
    }
  }
}

function handleRequest(request) {
  return {
    status: 200,
    headers: {},
    body: Buffer.from('content')
  }
}

test('applying middleware to a request handler', async t => {
  const request = {
    method: 'GET',
    url: '/',
    headers: {},
    body: Buffer.from('')
  }

  const response = await apply(middleware, handleRequest)(request)

  t.true(response.body.includes('content'))
  t.is(response.headers['Content-Type'], 'text/plain')
})

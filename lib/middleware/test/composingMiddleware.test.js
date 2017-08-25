/* @flow */
import test from 'ava'
import { compose } from 'middleware'

function addContentType(request, response) {
  return {
    ...response,
    headers: {
      ...response.headers,
      'Content-Type': 'text/plain'
    }
  }
}

function addContentLength(request, response) {
  return {
    ...response,
    headers: {
      ...response.headers,
      'Content-Length': '20'
    }
  }
}

test('composing middleware', async t => {
  const request = {
    method: 'GET',
    url: '/',
    headers: {},
    body: Buffer.from('')
  }

  const response = {
    status: 200,
    headers: {},
    body: Buffer.from('')
  }

  const composedMiddleware = compose(addContentLength, addContentType)
  const result = await composedMiddleware(request, response)
  t.is(result.headers['Content-Type'], 'text/plain')
  t.is(result.headers['Content-Length'], '20')
})

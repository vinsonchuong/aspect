/* @flow */
import test from 'test'
import { compress, gunzip } from 'middleware'

const compatibleRequest = {
  method: 'GET',
  url: '/',
  headers: { 'Accept-Encoding': 'gzip' },
  body: Buffer.from('')
}

const unknownCompatibilityRequest = {
  method: 'GET',
  url: '/',
  headers: {},
  body: Buffer.from('')
}

const incompatibleRequest = {
  method: 'GET',
  url: '/',
  headers: { 'Accept-Encoding': 'deflate' },
  body: Buffer.from('')
}

const compressibleResponse = {
  status: 200,
  headers: {
    'Content-Type': 'text/plain'
  },
  body: Buffer.from('aaaaaaaaaa')
}

const incompressibleResponse = {
  status: 200,
  headers: {
    'Content-Type': 'application/octet-stream'
  },
  body: Buffer.from('aaaaaaaaaa')
}

test('compressing a response', async t => {
  const result = await compress(compatibleRequest, compressibleResponse)
  const decompressedBody = await gunzip(result.body)

  t.is(result.headers['Content-Encoding'], 'gzip')
  t.is(decompressedBody.toString(), 'aaaaaaaaaa')
})

test('not compressing a response when the client does not send an Accept-Encoding header', async t => {
  const result = await compress(
    unknownCompatibilityRequest,
    compressibleResponse
  )
  t.is(result.body.toString(), 'aaaaaaaaaa')
})

test('not compressing a response when the client does not support gzip', async t => {
  const result = await compress(incompatibleRequest, compressibleResponse)
  t.is(result.body.toString(), 'aaaaaaaaaa')
})

test('not compressing an incompressible response', async t => {
  const result = await compress(compatibleRequest, incompressibleResponse)
  t.is(result.body.toString(), 'aaaaaaaaaa')
})

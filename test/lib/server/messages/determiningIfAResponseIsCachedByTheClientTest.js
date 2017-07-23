/* @flow */
import test from 'ava'
import * as http from 'http'
import { cachedByClient } from 'aspect/src/lib/server/messages'

const firstRequestDate = new Date('2017-01-01')
const firstRequest = new http.IncomingMessage()

const firstResponse = {
  modified: firstRequestDate,
  content: Buffer.from(''),
  type: 'txt'
}

const cachedRequest = new http.IncomingMessage()
cachedRequest.headers['if-modified-since'] = firstRequestDate.toUTCString()

const newResponse = {
  content: Buffer.from(''),
  type: 'txt',
  modified: new Date('2017-01-02')
}

test('returning false if the client has never requested the resource before', t => {
  t.false(cachedByClient(firstRequest, firstResponse))
})

test('returning true if the response has not been modified since the client last requested it', t => {
  t.true(cachedByClient(cachedRequest, firstResponse))
})

test('returning false if the response has been modified since the client last requested it', t => {
  t.false(cachedByClient(cachedRequest, newResponse))
})

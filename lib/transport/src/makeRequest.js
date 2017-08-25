/* @flow */
import type { Request, Response } from 'transport'
import { parseHeaders } from 'transport'
import fetch from 'node-fetch'

export default async function({
  method,
  url,
  headers,
  body
}: Request): Promise<Response> {
  const response = await fetch(url, {
    method,
    headers,
    body: method === 'GET' ? null : body
  })

  return {
    status: response.status,
    headers: parseHeaders(response.headers),
    body: await response.buffer()
  }
}

/* @flow */
import type { Session, Request, Response } from 'transport'
import { parseHeaders } from 'transport'
import { constants } from 'http2'
import { nextEvent, nextErrorEvent, streamToBuffer } from 'conversion'

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS
} = constants

export default async function(
  session: Session,
  { method, url, headers, body }: Request
): Promise<Response> {
  const stream = session.request({
    ...headers,
    [HTTP2_HEADER_METHOD]: method,
    [HTTP2_HEADER_PATH]: url
  })
  stream.end(Buffer.byteLength(body) > 0 ? body : null)

  const response = await Promise.race([
    readResponse(stream),
    nextErrorEvent('error', session),
    nextErrorEvent('frameError', session),
    nextErrorEvent('socketError', session)
  ])
  return response
}

async function readResponse(stream) {
  const headers = await nextEvent('response', stream)
  const body = await streamToBuffer(stream)
  return {
    status: headers[HTTP2_HEADER_STATUS],
    headers: parseHeaders(headers),
    body
  }
}

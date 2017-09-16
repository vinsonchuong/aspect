/* @flow */
import type { Server, Request, Response } from 'transport'
import { constants } from 'http2'
import { streamToBuffer } from 'conversion'
import { parseHeaders } from 'transport'

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS
} = constants

export default function(
  { httpServer }: Server,
  respond: Request => Response | Promise<Response>
): void {
  httpServer.on('stream', async (stream, headers) => {
    const response = await respond({
      method: headers[HTTP2_HEADER_METHOD],
      url: headers[HTTP2_HEADER_PATH],
      headers: parseHeaders(headers),
      body: await streamToBuffer(stream)
    })
    stream.respond({
      [HTTP2_HEADER_STATUS]: response.status,
      ...response.headers
    })
    stream.end(response.body)
  })
}

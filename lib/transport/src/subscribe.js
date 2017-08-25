/* @flow */
import type { Server, Request, Response } from 'transport'
import { parseHeaders } from 'transport'

export default function(
  { httpServer, port }: Server,
  respond: Request => Response | Promise<Response>
): void {
  httpServer.on('request', async (httpRequest, httpResponse) => {
    const { status, headers, body } = await respond({
      method: httpRequest.method,
      url: httpRequest.url,
      headers: parseHeaders(httpRequest.headers),
      body: Buffer.from('')
    })

    httpResponse.writeHead(status, headers)
    httpResponse.end(body)
  })
}

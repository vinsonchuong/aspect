/* @flow */
import type { Server } from 'http'
import { URL } from 'url'

export type Request = {
  method: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: URL
}
export type Response = string

export default function(
  server: Server,
  processRequest: Request => Response | Promise<Response>
): void {
  server.on('request', async (request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })

    const content = await processRequest({
      method: request.method,
      url: new URL(request.url, 'http://example.com')
    })
    response.end(content)
  })
}

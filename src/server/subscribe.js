/* @flow */
import type { Server } from './'
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
  server.httpServer.on('request', async (request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })

    const content = await processRequest({
      method: request.method,
      url: new URL(request.url, `http://127.0.0.1:${server.port}`)
    })
    response.end(content)
  })
}

/* @flow */
import type { Server } from './'
import { URL } from 'url'
import { gzip } from 'zlib'
import compressible from 'compressible'
import mime from 'mime'
import { cachedByClient } from './messages'

export type Request = { method: 'GET', url: URL, modified?: Date }
export type Response =
  | { content: Buffer, type: string, modified: Date }
  | { error: 'Not Found' }

export default function(
  server: Server,
  processRequest: Request => Response | Promise<Response>
): void {
  server.httpServer.on('request', async (httpRequest, httpResponse) => {
    const response = await processRequest({
      method: httpRequest.method,
      url: new URL(httpRequest.url, `http://127.0.0.1:${server.port}`)
    })

    if (response.error === 'Not Found') {
      httpResponse.writeHead(404)
      httpResponse.end()
    } else if (cachedByClient(httpRequest, response)) {
      httpResponse.writeHead(304)
      httpResponse.end()
    } else {
      const mimeType = mime.lookup(response.type)

      if (compressible(mimeType)) {
        httpResponse.writeHead(200, {
          'Content-Type': mimeType,
          'Content-Encoding': 'gzip',
          'Last-Modified': response.modified.toUTCString()
        })
        httpResponse.end(await compress(response.content))
      } else {
        httpResponse.writeHead(200, {
          'Content-Type': mimeType,
          'Last-Modified': response.modified.toUTCString()
        })
        httpResponse.end(response.content)
      }
    }
  })
}

function compress(content: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    gzip(content, (error, data) => {
      if (error) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}

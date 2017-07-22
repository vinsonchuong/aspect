/* @flow */
import fetch from 'node-fetch'
import mime from 'mime'

type Request = { method: 'GET', url: string, modified?: Date }
type Response =
  | {
      status: 'OK',
      size: number,
      content: string,
      type: 'html',
      modified: Date
    }
  | { status: 'Not Modified' }
  | { status: 'Not Found' }

export default async function(request: Request): Promise<Response> {
  const response = await fetch(request.url, {
    method: request.method,
    headers: {
      'If-Modified-Since': request.modified && request.modified.toUTCString()
    }
  })

  switch (response.statusText) {
    case 'OK':
      return {
        status: 'OK',
        size: Number(response.headers.get('Content-Length')),
        content: await response.text(),
        type: mime.extension(response.headers.get('Content-Type')),
        modified: new Date(response.headers.get('Last-Modified'))
      }
    case 'Not Modified':
      return {
        status: 'Not Modified'
      }
    case 'Not Found':
      return {
        status: 'Not Found'
      }
    default:
      throw new Error('Unexpected response status')
  }
}

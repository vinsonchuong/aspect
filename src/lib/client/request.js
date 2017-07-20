/* @flow */
import fetch from 'node-fetch'
import mime from 'mime'

type Request = { method: 'GET', url: string, modified?: Date }
type Response =
  | { status: 'OK', content: string, type: 'html', modified: Date }
  | { status: 'Not Modified' }

export default async function(request: Request): Promise<Response> {
  const response = await fetch(request.url, {
    method: request.method,
    headers: {
      'If-Modified-Since': request.modified && request.modified.toUTCString()
    }
  })

  if (response.statusText === 'OK') {
    return {
      status: 'OK',
      content: await response.text(),
      type: mime.extension(response.headers.get('Content-Type')),
      modified: new Date(response.headers.get('Last-Modified'))
    }
  } else {
    return {
      status: response.statusText
    }
  }
}

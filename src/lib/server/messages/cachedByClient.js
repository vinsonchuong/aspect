/* @flow */
import * as http from 'http'
import type { Response } from '../'

export default function(
  httpRequest: http.IncomingMessage,
  response: Response
): boolean {
  if (response.error || !('if-modified-since' in httpRequest.headers)) {
    return false
  }

  const cachedModified = new Date(httpRequest.headers['if-modified-since'])
  const responseModified = new Date(response.modified)
  responseModified.setUTCMilliseconds(0)

  return cachedModified >= responseModified
}

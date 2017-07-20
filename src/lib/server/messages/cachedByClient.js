/* @flow */
import * as http from 'http'
import type { Response } from '../'

export default function(
  httpRequest: http.IncomingMessage,
  response: Response
): boolean {
  if (!('if-modified-since' in httpRequest.headers)) {
    return false
  }

  const cachedModified = new Date(httpRequest.headers['if-modified-since'])
  return cachedModified >= response.modified
}

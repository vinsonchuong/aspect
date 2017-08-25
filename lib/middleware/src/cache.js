/* @flow */
import type { Request, Response } from 'transport'
import { fresh } from 'middleware'
import { pick } from 'lodash'

export default function(request: Request, response: Response): Response {
  if (fresh(request.headers, response.headers)) {
    return {
      status: 304,
      headers: pick(response.headers, [
        'Cache-Control',
        'Content-Location',
        'Date',
        'ETag',
        'Expires',
        'Last-Modified',
        'Vary'
      ]),
      body: Buffer.from('')
    }
  } else {
    return response
  }
}

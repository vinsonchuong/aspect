/* @flow */
import type { Request, Response } from 'transport'
import compressible from 'compressible'
import { gzip } from 'middleware'

export default async function(
  request: Request,
  response: Response
): Promise<Response> {
  if (
    'Accept-Encoding' in request.headers &&
    request.headers['Accept-Encoding'].includes('gzip') &&
    compressible(response.headers['Content-Type'])
  ) {
    return {
      ...response,
      headers: {
        ...response.headers,
        'Content-Encoding': 'gzip'
      },
      body: await gzip(response.body)
    }
  } else {
    return response
  }
}

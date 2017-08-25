/* @flow */
import type { Middleware } from 'middleware'
import type { Request, Response } from 'transport'

type RequestHandler = Request => Response | Promise<Response>

export default function(
  middleware: Middleware,
  handler: RequestHandler
): RequestHandler {
  return async request => middleware(request, await handler(request))
}

/* @flow */
import type { Middleware } from 'middleware'

export default function compose(
  middleware: Middleware,
  ...otherMiddlewares: Array<Middleware>
): Middleware {
  return async (request, response) =>
    otherMiddlewares.length > 0
      ? compose(...otherMiddlewares)(
          request,
          await middleware(request, response)
        )
      : middleware(request, response)
}

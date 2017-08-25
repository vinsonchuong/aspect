/* @flow */
import type { Server } from 'transport'
import * as path from 'path'
import { listen, subscribe } from 'transport'
import { staticFile } from 'responder'
import {
  apply as applyMiddleware,
  compose as composeMiddleware,
  cache,
  compress
} from 'middleware'

export default async function(port: ?number): Promise<Server> {
  const server = await listen(port)
  subscribe(
    server,
    applyMiddleware(
      composeMiddleware(cache, compress),
      staticFile(path.resolve('src'))
    )
  )
  return server
}

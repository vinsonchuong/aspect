/* @flow */
import type { Server } from 'transport'
import * as path from 'path'
import { parseEnv, optional, required } from 'env'
import { listen, subscribe } from 'transport'
import { staticFile } from 'responder'
import {
  apply as applyMiddleware,
  compose as composeMiddleware,
  cache,
  compress
} from 'middleware'

export default async function(): Promise<Server> {
  const config = parseEnv({
    PORT: optional(Number),
    CERTIFICATE: required(String),
    PRIVATE_KEY: required(String)
  })

  const server = await listen({
    port: config.PORT,
    certificate: config.CERTIFICATE,
    privateKey: config.PRIVATE_KEY
  })
  subscribe(
    server,
    applyMiddleware(
      composeMiddleware(cache, compress),
      staticFile(path.resolve('src'))
    )
  )
  return server
}

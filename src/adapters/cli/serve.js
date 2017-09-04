#!/usr/bin/env node
/* @flow */
import { serve } from 'aspect/src/adapters/server'
import { parseEnv, optional } from 'env'

async function run(): Promise<void> {
  const config = parseEnv({
    PORT: optional(Number)
  })

  const server = await serve({
    port: config.PORT
  })
  console.log(`Running server at http://127.0.0.1:${server.port}`)
}

run()

#!/usr/bin/env node
/* @flow */
import { serve } from 'aspect/src/adapters/server'

async function run(): Promise<void> {
  const server = await serve({
    port: 'PORT' in process.env ? Number(process.env.PORT) : null
  })
  console.log(`Running server at http://127.0.0.1:${server.port}`)
}

run()

#!/usr/bin/env run
/* @flow */
import { parseEnv, required } from 'env'
import { serve } from 'aspect/src/adapters/server'

async function run(): Promise<void> {
  const config = parseEnv({
    HOSTNAME: required(String)
  })
  const server = await serve()
  console.log(`Running server at https://${config.HOSTNAME}:${server.port}`)
}

run()

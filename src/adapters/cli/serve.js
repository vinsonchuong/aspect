/* @flow */
import { serve } from 'aspect/src/adapters/server'

async function run(): Promise<void> {
  const args = process.argv.slice(2)
  const port = args[0] ? Number(args[0]) : null

  const server = await serve(port)
  console.log(`Running server at http://127.0.0.1:${server.port}`)
}

run()

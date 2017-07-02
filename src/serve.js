/* @flow */
import type { Server } from 'aspect/src/server'
import { listen, subscribe } from 'aspect/src/server'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'

export default async function(port: ?number): Promise<Server> {
  const server = await listen(port)
  subscribe(server, respondToHttpRequest)
  return server
}

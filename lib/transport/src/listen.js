/* @flow */
import type { Server } from 'transport'
import * as http from 'http'
import getPort from 'get-port'

export default async function(
  options: { port?: ?number } = {}
): Promise<Server> {
  const port = typeof options.port === 'number' ? options.port : await getPort()

  const httpServer = new http.Server()
  httpServer.listen(port)
  await new Promise(resolve => {
    httpServer.on('listening', resolve)
  })
  return { httpServer, port }
}

/* @flow */
import type { Server } from 'transport'
import * as http from 'http'
import getPort from 'get-port'

export default async function(optionalPort: ?number): Promise<Server> {
  const port = optionalPort || (await getPort())
  const httpServer = new http.Server()
  httpServer.listen(port)
  await new Promise(resolve => {
    httpServer.on('listening', resolve)
  })
  return { httpServer, port }
}

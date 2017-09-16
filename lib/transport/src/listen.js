/* @flow */
import type { Server } from 'transport'
import { createSecureServer } from 'http2'
import getPort from 'get-port'

export default async function(options: {
  port?: ?number,
  certificate: string,
  privateKey: string
}): Promise<Server> {
  const port = typeof options.port === 'number' ? options.port : await getPort()

  const httpServer = createSecureServer({
    cert: options.certificate,
    key: options.privateKey
  })

  httpServer.listen(port)
  await new Promise(resolve => {
    httpServer.on('listening', resolve)
  })

  return { httpServer, port }
}

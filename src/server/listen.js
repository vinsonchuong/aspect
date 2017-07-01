/* @flow */
import { Server } from 'http'

export default function(port: number): Promise<Server> {
  const server = new Server()
  server.listen(port)
  return new Promise(resolve => {
    server.on('listening', () => {
      resolve(server)
    })
  })
}

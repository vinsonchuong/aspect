/* @flow */
import type { Server } from './'

export default function(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.httpServer.close(error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

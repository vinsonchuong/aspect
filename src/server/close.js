/* @flow */
import type { Server } from 'http'

export default function(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

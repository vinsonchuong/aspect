/* @flow */
import type { Server } from 'transport'

export default function({ httpServer }: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    httpServer.close(error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

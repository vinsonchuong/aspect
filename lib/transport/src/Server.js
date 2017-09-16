/* @flow */
import type { Server as HttpsServer } from 'tls'

export type Server = {
  httpServer: HttpsServer,
  port: number
}

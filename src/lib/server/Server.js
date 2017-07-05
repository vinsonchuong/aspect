/* @flow */
import type { Server as HttpServer } from 'http'

export type Server = {
  httpServer: HttpServer,
  port: number
}

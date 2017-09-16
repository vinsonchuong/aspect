import { EventEmitter } from 'events'
import { Duplex } from 'stream'
import { Server as TLSServer } from 'tls'

type RequestHeaders = {
  [string]: string
}

type ResponseHeaders = {
  ':status': number,
  [string]: string 
}

declare class Http2Stream extends Duplex {}

declare class ClientHttp2Stream extends Http2Stream {
  once(eventName: 'response', listener: (ResponseHeaders) => void): void,
  once(eventName: 'error', listener: (Error) => void): void,
  once(eventName: 'frameError', listener: (Error) => void): void,
  once(eventName: 'socketError', listener: (Error) => void): void
}

declare class Http2Session extends EventEmitter {
  request(headers: RequestHeaders): ClientHttp2Stream
}

declare class Http2SecureServer extends TLSServer {}

declare module 'http2' {
  declare var constants: {
    HTTP2_HEADER_METHOD: ':method',
    HTTP2_HEADER_PATH: ':path',
    HTTP2_HEADER_STATUS: ':status'
  }

  declare function connect(authority: string): Http2Session

  declare function createSecureServer(options: {
    key: string,
    cert: string
  }): Http2SecureServer
}

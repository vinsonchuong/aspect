/* @flow */
import type { Request, Response } from 'transport'

export type Middleware = (Request, Response) => Response | Promise<Response>

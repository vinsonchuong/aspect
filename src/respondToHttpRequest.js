/* @flow */
import type { Request, Response } from 'aspect/src/adapters/server'
import * as fs from 'fs-extra'
import * as path from 'path'

export default function(request: Request): Promise<Response> {
  return fs.readFile(path.resolve('src', 'index.html'))
}

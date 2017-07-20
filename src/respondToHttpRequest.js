/* @flow */
import type { Request, Response } from 'aspect/src/adapters/server'
import * as path from 'path'
import * as fs from 'fs-extra'

export default async function(request: Request): Promise<Response> {
  const requestedFilePath = path.join(path.resolve('src'), request.url.pathname)

  const stat = await fs.stat(requestedFilePath)
  const filePath = stat.isFile()
    ? requestedFilePath
    : path.join(requestedFilePath, 'index.html')

  return {
    content: await fs.readFile(filePath, 'utf8'),
    type: path.extname(filePath).slice(1),
    modified: stat.mtime
  }
}

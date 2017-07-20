/* @flow */
import type { Request, Response } from 'aspect/src/adapters/server'
import * as path from 'path'
import { readFile, stat } from 'aspect/src/lib/file'

export default async function(request: Request): Promise<Response> {
  const requestedFilePath = path.join(path.resolve('src'), request.url.pathname)

  const stats = await stat(requestedFilePath)
  const filePath = stats.isFile()
    ? requestedFilePath
    : path.join(requestedFilePath, 'index.html')

  return {
    content: await readFile(filePath, 'utf8'),
    type: path.extname(filePath).slice(1),
    modified: stats.mtime
  }
}

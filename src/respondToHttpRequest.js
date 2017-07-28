/* @flow */
import type { Request, Response } from 'aspect/src/adapters/server'
import type { Stats } from 'fs'
import * as path from 'path'
import { readFile, stat } from 'aspect/src/lib/file'

export default async function(request: Request): Promise<Response> {
  const requestedFilePath = path.join(path.resolve('src'), request.url.pathname)
  const requestedFileStats = await stat(requestedFilePath)

  if (isDirectory(requestedFileStats)) {
    const indexPath = path.join(requestedFilePath, 'index.html')
    const indexStats = await stat(indexPath)
    return buildResponse(indexPath, indexStats)
  } else {
    return buildResponse(requestedFilePath, requestedFileStats)
  }
}

function isDirectory(fileStats: ?Stats): boolean {
  return Boolean(fileStats && fileStats.isDirectory())
}

async function buildResponse(
  filePath: string,
  fileStats: ?Stats
): Promise<Response> {
  if (!fileStats) {
    return { error: 'Not Found' }
  }

  return {
    content: await readFile(filePath),
    type: path.extname(filePath).slice(1),
    modified: fileStats.mtime
  }
}

/* @flow */
import type { Request, Response } from 'transport'
import { notFound } from 'transport'
import * as path from 'path'
import { readFile, stat } from 'file'
import { computeContentType } from 'responder'

export default function(
  rootDirectoryPath: string
): Request => Promise<Response> {
  return async function respond(request) {
    const requestedPath = path.join(rootDirectoryPath, request.url)
    const requestedStats = await stat(requestedPath)

    if (!requestedStats) {
      return notFound
    } else if (requestedStats.isDirectory()) {
      return respond({
        ...request,
        url: path.join(request.url, 'index.html')
      })
    } else {
      return {
        status: 200,
        headers: {
          'Content-Type': computeContentType(request.url),
          'Last-Modified': requestedStats.mtime.toUTCString()
        },
        body: await readFile(requestedPath)
      }
    }
  }
}

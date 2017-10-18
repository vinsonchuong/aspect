/* @flow */
import type { Request, Response } from 'transport'
import * as path from 'path'
import { stat } from 'file'
import { compileJs, compileNpm } from 'compiler'
import { computeContentType } from 'responder'

export default function(
  rootDirectoryPath: string
): Request => Promise<Response> {
  return async function(request) {
    if (request.url.startsWith('/npm/')) {
      const requestedPath = request.url.slice(5)
      const requestedStats = await stat(
        path.resolve('node_modules', requestedPath)
      )

      if (!requestedStats) {
        return {
          status: 404,
          headers: {},
          body: Buffer.from('')
        }
      }

      return {
        status: 200,
        headers: {
          'Content-Type': computeContentType('npm.js'),
          'Last-Modified': requestedStats.mtime.toUTCString()
        },
        body: Buffer.from(await compileNpm(requestedPath))
      }
    } else {
      const requestedPath = path.join(rootDirectoryPath, request.url)
      const requestedStats = await stat(requestedPath)

      if (!requestedStats) {
        return {
          status: 404,
          headers: {},
          body: Buffer.from('')
        }
      }

      return {
        status: 200,
        headers: {
          'Content-Type': computeContentType(request.url),
          'Last-Modified': requestedStats.mtime.toUTCString()
        },
        body: Buffer.from(await compileJs(requestedPath))
      }
    }
  }
}

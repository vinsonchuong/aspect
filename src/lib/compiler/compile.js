/* @flow */
import type { Request, Response } from 'aspect/src/adapters/server'
import * as path from 'path'
import { stat } from 'aspect/src/lib/file'
import resolveNpm from 'resolve'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babelPresetDiff from 'babel-preset-diff'

export default async function(request: Request): Promise<Response> {
  if (forNpmPackage(request)) {
    const filePath = await getNpmPath(request)
    const fileStats = await stat(filePath)

    if (!fileStats) {
      return { error: 'Not Found' }
    }

    const bundle = await rollup({
      entry: filePath,
      plugins: [resolve(), commonjs()]
    })
    const { code } = await bundle.generate({ format: 'es' })

    return {
      type: 'js',
      modified: fileStats.mtime,
      content: Buffer.from(code)
    }
  } else {
    const filePath = path.join(path.resolve('src'), request.url.pathname)
    const fileStats = await stat(filePath)

    if (!fileStats) {
      return { error: 'Not Found' }
    }

    const bundle = await rollup({
      entry: filePath,
      external: id => id !== filePath,
      plugins: [
        babel({
          babelrc: false,
          presets: [[babelPresetDiff, { modules: false }]]
        })
      ]
    })
    const { code } = await bundle.generate({ format: 'es' })

    return {
      type: 'js',
      modified: fileStats.mtime,
      content: Buffer.from(code)
    }
  }
}

function forNpmPackage(request: Request): boolean {
  return request.url.pathname.startsWith('/npm')
}

async function getNpmPath(request: Request): Promise<string> {
  const modulePath = path.relative('/npm', request.url.pathname)
  return new Promise((resolve, reject) => {
    resolveNpm(modulePath, {}, (error, filePath) => {
      if (error) reject(error)
      else resolve(filePath)
    })
  })
}

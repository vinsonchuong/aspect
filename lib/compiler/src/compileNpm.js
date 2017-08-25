/* @flow */
import resolveNpm from 'resolve'
import { rollup } from 'rollup'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default async function(moduleName: string): Promise<string> {
  const bundle = await rollup({
    entry: await getNpmPath(moduleName),
    plugins: [resolve(), commonjs()]
  })
  const { code } = await bundle.generate({ format: 'es' })
  return code
}

function getNpmPath(moduleName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    resolveNpm(moduleName, {}, (error, filePath) => {
      if (error) reject(error)
      else resolve(filePath)
    })
  })
}

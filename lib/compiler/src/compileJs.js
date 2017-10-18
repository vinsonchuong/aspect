/* @flow */
import * as path from 'path'
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import babelPresetDiff from 'babel-preset-diff'

export default async function(filePath: string): Promise<string> {
  const bundle = await rollup({
    input: filePath,
    external: id => id !== filePath,
    plugins: [
      babel({
        babelrc: false,
        presets: [[babelPresetDiff, { modules: false }]]
      })
    ]
  })
  const { code } = await bundle.generate({
    format: 'es',
    paths: id =>
      id.match(/^[a-zA-Z0-9]/) ? `/npm/${id}` : relativeModulePath(filePath, id)
  })
  return code
}

function relativeModulePath(fromFile, toFile) {
  const relativePath = path.relative(path.dirname(fromFile), toFile)
  if (relativePath === '..') {
    return '../'
  } else if (relativePath === '') {
    return './'
  } else if (!relativePath.startsWith('.')) {
    return `./${relativePath}`
  } else {
    return relativePath
  }
}

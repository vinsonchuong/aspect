/* @flow */
import { rollup } from 'rollup'
import babel from 'rollup-plugin-babel'
import babelPresetDiff from 'babel-preset-diff'

export default async function(filePath: string): Promise<string> {
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
  return code
}

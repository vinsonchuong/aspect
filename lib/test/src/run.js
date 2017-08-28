/* @flow */
import { runAva, setPackageConfig } from 'test/src/runner'

export default function(): void {
  setPackageConfig('ava', {
    babel: {
      presets: ['diff']
    },
    require: ['babel-register']
  })

  runAva()
}

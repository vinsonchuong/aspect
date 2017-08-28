/* @flow */
import test from 'test'
import { setPackageConfig } from 'test/src/runner'
import pkgConf from 'pkg-conf'

test('setting package config', t => {
  t.deepEqual(pkgConf.sync('some-package'), {})

  setPackageConfig('some-package', {
    option: 'value'
  })

  t.deepEqual(pkgConf.sync('some-package'), {
    option: 'value'
  })
})

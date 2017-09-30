#!/usr/bin/env node
/* @flow */
import runAva from './runAva'
import setPackageConfig from './setPackageConfig'

setPackageConfig('ava', {
  babel: {
    presets: ['diff']
  },
  require: ['babel-register']
})

runAva()

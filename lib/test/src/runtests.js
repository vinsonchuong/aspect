#!/usr/bin/env run
/* @flow */
import runAva from './runAva'
import setPackageConfig from './setPackageConfig'
import babelOptions from 'compiler/babel-options'

setPackageConfig('ava', {
  babel: babelOptions,
  require: ['compiler/node-hook']
})

runAva()

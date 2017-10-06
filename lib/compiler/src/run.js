#!/usr/bin/env node
/* @flow */
const path = require('path')
require('compiler/node-hook')
process.argv.splice(1, 1)

// $FlowFixMe
require(path.resolve(process.argv[1]))

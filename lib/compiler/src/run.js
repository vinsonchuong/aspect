#!/usr/bin/env node
const path = require('path')
require('compiler/node-hook')
process.argv.splice(1, 1)
require(path.resolve(process.argv[1]))

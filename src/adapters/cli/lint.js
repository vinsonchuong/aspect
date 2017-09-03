#!/usr/bin/env node
/* @flow */
process.argv = [...process.argv, '--verbose', '--fix']
require('standard-esnext/bin/standard')

/* @flow */
import test from 'test'
import { parseEnv, optional, required } from 'env'

process.env.PORT = '80'
process.env.KEY = 'secret'

test('parsing environment variables', t => {
  const result = parseEnv({
    PORT: required(Number),
    KEY: required(String)
  })

  t.is(result.PORT, 80)
  t.is(result.KEY, 'secret')
})

test('parsing optional environment variables', t => {
  const result = parseEnv({
    MISSING: optional(String)
  })

  t.is(result.MISSING, null)
})

test('parsing missing required environment variables', t => {
  t.throws(() => {
    parseEnv({
      MISSING: required(String)
    })
  }, 'MISSING is not defined in the environment')
})

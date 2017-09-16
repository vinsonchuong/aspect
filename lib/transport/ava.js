/* @flow */
import test from 'ava'
import { parseEnv, required } from 'env'
import { listen, close } from 'transport'

export function useCertificate(): void {
  test.beforeEach(t => {
    const config = parseEnv({
      HOSTNAME: required(String),
      CERTIFICATE: required(String),
      PRIVATE_KEY: required(String)
    })

    t.context = {
      ...t.context,
      hostname: config.HOSTNAME,
      certificate: config.CERTIFICATE,
      privateKey: config.PRIVATE_KEY
    }
  })
}

export function useServer(): void {
  useCertificate()

  test.beforeEach(async t => {
    const { certificate, privateKey } = t.context
    const server = await listen({ certificate, privateKey })
    t.context = { ...t.context, server }
  })

  test.afterEach.always(async t => {
    const { server } = t.context
    await close(server)
  })
}

/* @flow */
import test from 'ava'
import { listen, close } from 'transport'

export function useServer(): void {
  test.beforeEach(async t => {
    const server = await listen()
    Object.assign(t.context, { server })
  })

  test.afterEach.always(async t => {
    const { server } = t.context
    await close(server)
  })
}

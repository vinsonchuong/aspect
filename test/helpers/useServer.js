/* @flow */
import test from 'ava'
import { serve, close } from 'aspect/src/adapters/server'

export default function(): void {
  test.beforeEach(async t => {
    const server = await serve()
    Object.assign(t.context, { server })
  })

  test.afterEach.always(async t => {
    const { server } = t.context
    await close(server)
  })
}

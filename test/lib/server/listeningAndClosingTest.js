/* @flow */
import test from 'ava'
import { listen, close } from 'aspect/src/lib/server'
import { getOpenSockets } from 'aspect/src/lib/cli'

test('starting a server opens a listening socket and closing the server closes the socket', async t => {
  const server = await listen()
  t.true(await listeningSocketsInclude(`:::${server.port}`))

  await close(server)
  t.false(await listeningSocketsInclude(`:::${server.port}`))
})

async function listeningSocketsInclude(address: string): Promise<boolean> {
  const openSockets = await getOpenSockets()
  return openSockets.includes(address)
}

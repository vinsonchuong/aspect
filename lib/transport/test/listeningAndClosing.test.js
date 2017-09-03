/* @flow */
import test from 'test'
import { listen, close } from 'transport'
import { getOpenSockets } from 'cli'

test('starting a server opens a listening socket and closing the server closes the socket', async t => {
  const server = await listen()
  t.true(await listeningSocketsInclude(`:::${server.port}`))

  await close(server)
  t.false(await listeningSocketsInclude(`:::${server.port}`))
})

test('starting a server on a specific port', async t => {
  const server = await listen({ port: 9999 })
  t.true(await listeningSocketsInclude(`:::9999`))
  await close(server)
})

async function listeningSocketsInclude(address: string): Promise<boolean> {
  const openSockets = await getOpenSockets()
  return openSockets.includes(address)
}

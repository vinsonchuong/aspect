/* @flow */
import test from 'ava'
import { childProcess } from 'node-promise-es6'
import { listen, close } from 'aspect/src/server'

test('starting a server opens a listening socket and closing the server closes the socket', async t => {
  const server = await listen()
  t.true(await listeningSocketsInclude(`:::${server.port}`))

  await close(server)
  t.false(await listeningSocketsInclude(`:::${server.port}`))
})

async function listeningSocketsInclude(address: string): Promise<boolean> {
  const { stdout } = await childProcess.exec('ss -ltn')
  return stdout
    .split('\n')
    .slice(1)
    .map(line => line.split(/\s+/)[3])
    .includes(address)
}

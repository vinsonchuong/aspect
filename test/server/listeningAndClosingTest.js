/* @flow */
import test from 'ava'
import getPort from 'get-port'
import { childProcess } from 'node-promise-es6'
import { listen, close } from 'aspect/src/server'

test('starting a server opens a listening socket and closing the server closes the socket', async t => {
  const port = await getPort()

  const server = await listen(port)
  t.true(await listeningSocketsInclude(`:::${port}`))

  await close(server)
  t.false(await listeningSocketsInclude(`:::${port}`))
})

async function listeningSocketsInclude(address: string): Promise<boolean> {
  const { stdout } = await childProcess.exec('ss -ltn')
  return stdout
    .split('\n')
    .slice(1)
    .map(line => line.split(/\s+/)[3])
    .includes(address)
}

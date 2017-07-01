# Aspect
Studying how to build web apps

## Development Practices
My goal is to write a production-quality blogging app to host my ideas and view
them in different ways.

Starting from a
[walking skeleton](http://alistair.cockburn.us/Walking+skeleton), I will evolve
the architecture and the functionality of the code base incrementally over time.
At every stage, the goal will be to ease development of the next piece of
functionality.

### Starting from a Walking Skeleton
> User can view the most recent blog post

The application can start as a file server serving a static HTML file. Basic
functionality like this is easy to implement, giving me a good opportunity
to start building out tooling and infrastructure for development.

I'll be implementing the application in JavaScript (both on the frontend and
backend). I'll be adhering to test-driven development. I'll set up tooling for
forcing the use of type annotations and automatically enforcing style
conventions.

My first test will ensure that I can start up a server on my development
machine and see an empty HTML page.

```js
/* @flow */
import test from 'ava'
import * as path from 'path'
import { serve, close as closeServer } from 'aspect/src/server'
import {
  makeHeadlessChromeAdapter,
  close as closeBrowser,
  navigate,
  findElement,
  getText
} from 'selenium-adapter'

test.beforeEach(async t => {
  const server = await serve(8080, path.resolve('src/index.html'))
  const browser = makeHeadlessChromeAdapter()
  t.context = { server, browser }
})

test.afterEach.always(async t => {
  const { server, browser } = t.context
  await closeBrowser(browser)
  await closeServer(server)
})

test.serial('viewing the app over HTTP', async t => {
  const { browser } = t.context
  await navigate(browser, 'http://127.0.0.1:8080')
  const paragraph = await findElement(browser, 'p')
  t.is(await getText(paragraph), 'Hello World!')
})
```

The above is an integration test that exercises several concerns:

* Starting a server that listens on a given port
* Responding to requests with the contents of a file
* Viewing a working web page from a browser
* Stopping the server
* Closing the browser
* Fitting all of the above pieces together
* Writing test cases
* Running the code

The concerns related to automating a browser are all implemented and tested by
an [external library](https://github.com/vinsonchuong/selenium-adapter). Tooling
that enables writing tests and running code written using newer JavaScript
features have been researched in advance and configured outside of the TDD
process.

Let's start test-driving out the server concerns.

> Starting a server that listens on a given port

> Stopping the server

Even though the integration test covers the desired functionality, it does not
allow me to get focused feedback on the particular concern I am trying to build.

It's necessary to test the two concerns together as the first concern has a
side-effect that the second concern cleans up.

```js
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
  return stdout.split('\n')
    .slice(1)
    .map(line => line.split(/\s+/)[3])
    .includes(address)
}
```

The implementation that makes the test pass is

```js
/* @flow */
import { Server } from 'http'

export function listen(port: number): Promise<Server> {
  const server = new Server()
  server.listen(port)
  return new Promise(resolve => {
    server.on('listening', () => {
      resolve(server)
    })
  })
}

export function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close(error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}
```

Implementation-wise, both of these concerns are independent. Both only depend
on the interface provided by the `http.Server` class.

> Responding to requests with the contents of a file

Writing a test to exercise this concern is more challenging because it depends
on a listening server that can receive requests. However, since I've already
implemented and tested that dependency, I can reuse it here.

```js
/* @flow */
import test from 'ava'
import getPort from 'get-port'
import fetch from 'node-fetch'
import { listen, close, subscribe } from 'aspect/src/server'

test.beforeEach(async t => {
  const port = await getPort()
  const server = await listen(port)
  t.context = { server, port }
})

test.afterEach.always(async t => {
  const { server } = t.context
  await close(server)
})

test('responding to requests', async t => {
  const { server, port } = t.context
  subscribe(server, request => {
    t.is(request.method, 'GET')
    t.is(request.url.pathname, '/')
    return `
      <!doctype html>
      <meta charset="utf-8">
    `
  })
  const response = await request(`http://127.0.0.1:${port}`)
  t.true(response.includes('html'))
})

async function request(url: string): Promise<string> {
  const response = await fetch(url)
  return response.text()
}
```

The following implementation satisfies current requirements while laying the
groundwork for future functionality.

```js
/* @flow */
import type { Server } from 'http'
import { URL } from 'url'

export type Request = {
  method: 'HEAD' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  url: URL
}
export type Response = string

export function subscribe(
  server: Server,
  processRequest: Request => Response | Promise<Response>
): void {
  server.on('request', async (request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })

    const content = await processRequest({
      method: request.method,
      url: new URL(request.url, 'http://example.com')
    })
    response.end(content)
  })
}
```

Now, putting the pieces together and making the integration pass:

```js
/* @flow */
import * as fs from 'fs-extra'
import type { Server } from 'http'
import { listen, subscribe } from './'

export async function serve(port: number, filePath: string): Promise<Server> {
  const server = await listen(port)
  subscribe(server, request => fs.readFile(filePath))
  return server
}
```

`serve` is responsible for taking working building blocks and wiring them
together. It is already exercised appropriately by the integration test.
However, the `subscribe` handler that reads a given file from the file system
should be extracted and unit tested independently.

```js
/* @flow */
import test from 'ava'
import { URL } from 'url'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'

test('generating a static response to HTTP requests', async t => {
  const response = await respondToHttpRequest({
    method: 'GET',
    url: new URL('http://example.com/')
  })
  t.true(response.includes('<!doctype html>'))
})
```

```js
/* @flow */
import type { Request, Response } from 'aspect/src/server'
import * as fs from 'fs-extra'
import * as path from 'path'

export function respondToHttpRequest(request: Request): Promise<Response> {
  return fs.readFile(path.resolve('src', 'index.html'))
}
```

With the extraction of `respondToHttpRequest`, it no longer makes sense for
`serve` to control what static file is returned. `respondToHttpRequest` is
responsible for what response to return. The responsibility of `serve` is now
unclear; so, I'm going to inline it into the integration test.

```js
/* @flow */
import test from 'ava'
import { listen, subscribe, close as closeServer } from 'aspect/src/server'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'
import {
  makeHeadlessChromeAdapter,
  close as closeBrowser,
  navigate,
  findElement,
  getText
} from 'selenium-adapter'

test.beforeEach(async t => {
  const server = await listen(8080)
  subscribe(server, respondToHttpRequest)
  const browser = makeHeadlessChromeAdapter()
  t.context = { server, browser }
})

test.afterEach.always(async t => {
  const { server, browser } = t.context
  await closeBrowser(browser)
  await closeServer(server)
})

test.serial('viewing the app over HTTP', async t => {
  const { browser } = t.context
  await navigate(browser, 'http://127.0.0.1:8080')
  const paragraph = await findElement(browser, 'p')
  t.is(await getText(paragraph), 'Hello World!')
})
```

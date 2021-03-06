# Aspect
[![Build Status](https://travis-ci.org/vinsonchuong/aspect.svg?branch=master)](https://travis-ci.org/vinsonchuong/aspect)

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

#### Test-Driving a Static File Server
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

#### Starting the Static File Server Outside of Test
I need to be able to view the application myself in a browser. The codebase will
have to change to enable this usecase. Specifically, the test-setup logic inside
of the integration test will need to be extracted for reuse.

Echoing an article named
"[First-Class Tests](http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html)"
by Uncle Bob, production, test, and development usecases all fall under the
same standards for quality. Hence, sharing code between the different sets of
usecases should be fair game.

```js
/* @flow */
import type { Server } from 'aspect/src/server'
import { listen, subscribe } from 'aspect/src/server'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'

export async function serve(): Promise<Server> {
  const server = await listen(8080)
  subscribe(server, respondToHttpRequest)
  return server
}
```

The integration test always runs the server on port `8080`. Other tests use the
`get-port` library to choose a random open port. A CLI for starting the server
should have a default port that is configurable. A new concern is emerging that
has multiple instances scattered throughout the code.

Upon taking a look at all of the code locations where a port is selected, it's
clear that port selection is always done prior to calling `listen` to start a
server. I've decided to move the port selection logic into the `listen`
function.

```js
/* @flow */
import type { Server } from './'
import * as http from 'http'
import getPort from 'get-port'

export async function listen(optionalPort: ?number): Promise<Server> {
  const port = optionalPort || (await getPort())
  const httpServer = new http.Server()
  httpServer.listen(port)
  await new Promise(resolve => {
    httpServer.on('listening', resolve)
  })
  return { httpServer, port }
}
```

To enable a CLI to configure the port, `listen` takes it as an optional
parameter. `serve` now also takes an optional port parameter:

```js
/* @flow */
import type { Server } from 'aspect/src/server'
import { listen, subscribe } from 'aspect/src/server'
import respondToHttpRequest from 'aspect/src/respondToHttpRequest'

export default async function(port: ?number): Promise<Server> {
  const server = await listen(port)
  subscribe(server, respondToHttpRequest)
  return server
}
```

So far, I haven't given much thought to directory structure. Now that distinct
groups of concerns have started to reveal themselves, I stand a chance at
finding a directory structure that makes sense. So far, I've written utilities
for managing an HTTP server, making HTTP requests, and exercising CLIs. Those
utilities are essentially standalone libraries that can be extracted at any
time. Then, there is code that adapts each library for easier use by the domain.

* adapters
  * cli
    * serve.js
  * server
    * index.js
    * serve.js
* lib
  * cli
    * index.js
    * kill.js
    * spawn.js
    * waitForInput.js
  * client
    * index.js
    * request.js
  * server
    * close.js
    * index.js
    * listen.js
    * Server.js
    * subscribe.js
* respondToHttpRequest.js

The organization of test cases roughly follows the directory structure:

* adapters
  * cli
    * serveTest.js
* lib
  * server
    * listeningAndClosingTest.js
    * respondingToRequestsTest.js
* respondingToHttpRequestTest.js
* viewingMostRecentPostTest.js

Utilities used only in test cases are themselves currently untested. I figure
it's a good idea to backfill those tests so that when these libraries get built
out further, I won't have to go back and backfill later. Furthermore, since
these utilities are currently small, fully testing them would not take much
time.

#### Continuous Integration
Since this is a conventional Node.js application, most CI services can install
external dependencies and run tests for this project without much configuration.

For this project, I'll be using Travis CI with the following configuration:

```yml
dist: trusty
sudo: false
language: node_js
node_js: node
cache: yarn
```

#### Continuous Deployment
Pivotal Web Services provides cheap application instance hosting; so, until my
application has more infrastructure requirements, I'll deploy the application
there. Cloudfoundry is able to deal with the conventional Node.js application
out of the box; so, only a little bit of configuration is necessary.

Travis CI also supports continuous deployment to Cloud Foundry with a bit of
configuration. I've set it up to deploy every passing commit.

Now, with the application deployed and publicly accessible, on to the next
feature!

### Building out a Frontend and Backend
> User can add blog posts

This feature requires data persistence, which necessitates a backend API that
mediates communication between a data store and the frontend.

Let's start with an end-to-end test.

```js
/* @flow */
import test from 'ava'
import { serve, close as closeServer } from 'aspect/src/adapters/server'
import {
  makeHeadlessChromeAdapter,
  close as closeBrowser,
  navigate,
  findElement,
  click
  getText
} from 'selenium-adapter'

test.beforeEach(async t => {
  const server = await serve()
  const browser = makeHeadlessChromeAdapter()
  t.context = { server, browser }
})

test.afterEach.always(async t => {
  const { server, browser } = t.context
  await closeBrowser(browser)
  await closeServer(server)
})

test('viewing the app over HTTP', async t => {
  const { server, browser } = t.context
  await navigate(browser, `http://127.0.0.1:${server.port}`)

  const newPostLink = await findElement(browser, 'a', 'New Post')
  await click(newPostLink)

  const titleInput = await findElement(browser, 'input#title')
  await fillIn(titleInput, 'New Blog Post')

  const contentInput = await findElement(browser, 'textarea#content')
  await fillIn(contentInput, 'New blog post content.')

  const postButton = await findElement(browser, 'input[type="submit"]')
  await click(postButton)

  const title = await findElement(browser, 'article h1')
  t.is(await getText(title), 'New Blog Post')

  const content = await findElement(browser, 'article p')
  t.is(await getText(content), 'New blog post content.')
})
```

There's a common pattern in finding an element and then interacting with it. To
capture this concept, it's time to write a browser lib. Also, to ensure that
I'm not importing browser interaction utilities from multiple places, I'll be
completely wrapping `selenium-adapter`.

The refactored test is

```js
/* @flow */
import test from 'ava'
import { useBrowser, useServer } from 'aspect/test/helpers'
import { navigate, clickOn, fillIn, read } from 'aspect/src/lib/browser'

useBrowser()
useServer()

test('viewing the app over HTTP', async t => {
  const { server, browser } = t.context
  await navigate(browser, `http://127.0.0.1:${server.port}`)

  await clickOn(browser, 'New Post')
  await fillIn(browser, 'Title', 'New Blog Post')
  await fillIn(browser, 'Content', 'New blog post content.')
  await clickOn(browser, 'Post')

  t.is(await read('article p'), 'New blog post content.')
})
```

#### Serving Static Content
Serving a frontend application to a browser requires a more fully-featured
static file server, one that can:

* Serve arbitrary files from the file system
* Allow the browser to cache unchanged files
* Compress where appropriate
* Serve multiple requests at once
* Use HTTPS while developing

With those features in place, the server then needs to be able to compile and
serve JavaScript code and external packages to the browser.

In implementing this set of features, I'm finding that the logic to figure out
what content to use to respond to a request is complex. Not only is the mapping
from URL to filesystem path complex, the processing of the content is also
complex. I need to find the right boundaries to manage this complexity.

##### Extracting Lib Packages
At this point, I'm finding that the `src` directory is becoming large and
difficult to reason about. The directory is cluttered with modules that are
feature-complete and do not need to be modified during feature development.

I want to try an experiment where I partition these modules away from the
application code.

After extraction, the directory structure of the codebase now looks like:

* lib
  * browser
  * cli
  * compiler
  * file
  * middleware
  * responder
  * transport
* src
  * adapters
    * cli
      * serve.js
    * server
      * index.js
      * serve.js
  * favicon.ico
  * index.css
  * index.html
  * index.js
* test
  * adapters
    * cli
      * serveTest.js
  * addingABlogPostTest.js
  * helpers
    * index.js
    * useServer.js

Each library is essentially its own package with its own dependencies. For
example:

* file
  * ava.js
  * package.json
  * src
    * index.js
    * makeTmpDirectory.js
    * readFile.js
    * stat.js
    * writeIntoDirectory.js
  * test
    * makingTemporaryDirectoriesTest.js
    * readingFileMetadataTest.js

The root `package.json` file now lists the following dependencies:

```json
{
  "dependencies": {
    "babel-preset-diff": "^1.0.3",
    "babel-register": "^6.26.0",
    "cli": "link:./lib/cli",
    "compiler": "link:./lib/compiler",
    "middleware": "link:./lib/middleware",
    "react": "^15.6.1",
    "responder": "link:./lib/responder",
    "server": "link:./lib/server",
    "transport": "link:./lib/transport"
  },
  "devDependencies": {
    "ava": "^0.22.0",
    "browser": "link:./lib/browser",
    "flow-bin": "^0.53.1",
    "flow-typed": "^2.1.5",
    "standard-esnext": "^3.0.3"
  }
}
```

The `file` library lists its own dependencies:

```json
{                                                                                                                                          
  "dependencies": {
    "dedent": "^0.7.0",
    "fs-extra": "^4.0.0",
    "tempy": "^0.1.0"
  },
  "devDependencies": {
  }
}
```

With this partition between library code and application code, there is now less
mental overhead--fewer files to keep track of--when developing features.

Also, during the extraction, I separated the server module into a transport
layer, a respnder layer, and a middleware layer. The transport layer is
feature-complete and should need no further modification. The middleware layer
can be extended by adding new middleware without having to modify existing
middleware. New responders can similarly be added without having to modify
existing responders. These layers follow the
[open/closed principle](https://en.wikipedia.org/wiki/Open/closed_principle).

I took this process one step further and extracted a `test` library for running
and defining automated tests. Because I chose to use an off-the-shelf tool
instead of implementing one from scratch, encapsulating it has proven difficult.
With the large surface area provided by the tool and the number of existing test
cases in the codebase, it's an interesting challenge.

Interesting questions and learnings I've encountered during this exercise are:

* Should these libraries be open-sourced as seprate projects?
* How should I document the APIs of these libaries? Are test cases enough?
* Am I able to effectively wrap existing tools with large APIs?
* Do I need to manage dependencies between the libraries?
* Which test cases do I run when I modify application or library code?

##### Serving Static Assets via HTTP/2
In preparation for serving many small JavaScript dependencies to the browser
in development, I'll focus now on extending the `transport` library to be able
to serve via HTTP/2 and HTTPS.

###### Generating a Trusted Certificate
[Let's Encrypt](https://letsencrypt.org/) provides free and trusted X.509
certificates. It also provides tooling for automatically generating and renewing
certificates. It also verifies ownership over a domain before granting a
certificate.

Running a development server that can serve requests over HTTPS requires either
a self-signed certificate, which would require modification of browser security
settings, or a trusted certificate associated with a publicly accessible
hostname.

I've chosen to use a subdomain of my personal domain (`dev.vinsonchuong.net`) to
request a certificate. My domain is registered using
[Google Domains](https://domains.google) and served using
[Cloudflare](https://www.cloudflare.com/). I've made sure to set the nameservers
correctly and enable DNSSEC. I've created an A record pointing `dev` to
`127.0.0.1`, which will allow me to request a certificate for
`dev.vinsonchuong.net` and use it for development.

Given that my domain is configured as above, [certbot](https://certbot.eff.org/)
is able to automatically request and renew trusted certificates.

###### Storing Secrets for Use in Different Environments
The codebase will depend on the certificate I've generated. I'll need to ensure
that wherever the code needs to run, the certificate is accessible. However,
certificates need to remain private as they are used to validate identity.

[The Twelve-Factor App](https://12factor.net/config) recommends storing such
secrets as environment variables.

I've chosen to store the secrets in a `.env` file, which when executed, will
export them as environment variables. This file will not be committed to the
repository. To make the secrets available to CI, they are encrypted and
committed as `.env.enc`.

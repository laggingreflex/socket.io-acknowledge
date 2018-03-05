# socket.io-acknowledge

Acknowledge API for Socket.io

## Install

```
npm i socket.io-acknowledge
```

## Usage

### **`client`**

```js
const SocketIO = require('socket.io-client')
const Acknowledge = require('socket.io-acknowledge')

const socket = SocketIO(SERVER_URL)
Acknowledge.client(opts)(socket)

async function example() {
  try {
    /* socket.emit returns acknowledgement promise */
    const value = await socket.emit('example', data)

  } catch (error) {
    /* socket.emit throws acknowledgement error */
    console.error(error)
  }
}
```


### **`server`**

```js
const SocketIO = require('socket.io')
const Acknowledge = require('socket.io-acknowledge')

const io = SocketIO({})
io.use(Acknowledge.server(opts))

io.on('connect', socket => {

  /* socket.on handlers can be async */
  socket.on('example', async data => {
    if (…) {
      /* socket.on handlers' returns get acknowledged by originating emit functions */
      return value
    } else {
      /* socket.on handlers' errors get thrown by originating emit functions */
      throw new Error(…)
    }
  })

})
```

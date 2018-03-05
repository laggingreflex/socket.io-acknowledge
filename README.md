# socket.io-acknowledge

Adds acknowledgement functions to `socket.emit` and makes it return a promise which resolves/rejects based on what its corresponding `socket.on` handler function returns or throws:

* **`client`**

  ```js
  const value = await socket.emit('example', 123)
  ```

* **`server`**

  ```js
  socket.on('example', async data => {
    return await 'value'
  })
  ```


## Install

```
npm i socket.io-acknowledge
```

## Usage

### **`client`**

```js
const SocketIO = require('socket.io-client')
const acknowledge = require('socket.io-acknowledge')

const socket = SocketIO(SERVER_URL)
acknowledge(socket)

async function example() {
  try {
    /* socket.emit returns acknowledgement promise */
    const value = await socket.emit('example', data)

  } catch (error) {
    /* or throws acknowledgement error */
    console.error(error)
  }
}
```


### **`server`**

```js
const SocketIO = require('socket.io')
const acknowledge = require('socket.io-acknowledge')

const io = SocketIO({})
io.use(acknowledge)

io.on('connect', socket => {

  /* socket.on handlers can be async */
  socket.on('example', async data => {
    if (…) {
      /* socket.on handler's return values acknowledged by originating emit functions */
      return value
    } else {
      /* or get thrown by originating emit functions */
      throw new Error(…)
    }
  })

})
```

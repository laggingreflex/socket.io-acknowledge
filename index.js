const { emit, on, send } = require('./symbol');
const reservedEvents = require('./reserved-events');

module.exports = (socket, next) => {
  socket[emit] = socket.emit;
  socket[on] = socket.on;
  socket[send] = socket.send;

  socket.emit = (event, ...args) => {
    if (reservedEvents.includes(event)) return socket[emit](event, ...args);

    const ack = args[args.length - 1];
    if (typeof ack === 'function') {
      // ack callback provided; do not interfere
      return socket[emit](event, ...args);
    } else {
      // attach ack callback and convert to promise
      return new Promise((resolve, reject) => {
        socket[emit](event, ...args, (error, data) => {
          if (error) {
            reject(typeof error === 'string' ? new Error(error) : error);
          } else {
            resolve(data);
          }
        });
      });
    }
  };

  socket.on = (event, handler) => {
    if (reservedEvents.includes(event)) return socket[on](event, handler);

    return socket[on](event, async function(...args) {
      const ack = args[args.length - 1];
      if (typeof ack === 'function') {
        try {
          ack(null, await handler.call(this, ...args.slice(0, -1)));
        } catch (error) {
          ack(error.message);
        }
      } else {
        return handler(...args);
      }
    });
  };

  socket.send = (data) => new Promise((o, x) => socket[send](data, (err, data) => err ? x(err) : o(data)));

  if (next) next();
  return socket;
};

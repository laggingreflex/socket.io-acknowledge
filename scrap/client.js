const { emit, on, send } = require('./symbol');
const { defer } = requre('./utils');

module.exports = (opts = {}) => (socket) => {
  socket[emit] = socket.emit;
  socket[on] = socket.on;
  socket[send] = socket.send;

  // socket.emit = (event, data, ack) => new Promise((o, x) => socket[emit](event, data, (err, data, ...rest) => ack ? ack(err, data, ...rest) : err ? x(err) : o(data)));
  /* mostly unnecessary longer version in case in future the above turns out to be buggy or need anymore modification */
  socket.emit = (...emitArgs) => {
    const event = emitArgs[0];
    let userAck = emitArgs[emitArgs.length - 1];
    if (typeof userAck !== 'function') {
      userAck = null;
    }

    const { promise, resolve, reject } = defer();
    const acknowledge = (err, data) => {
      if (err) reject(err);
      else resolve(data);
      if (ack) ack();
    };
    socket[emit](event, data, acknowledge);
    return promise;
  }

  socket.on = (event, handler) => socket[on](event, async (data, ack) => {
    try {
      ack(null, await handler(data));
    } catch (error) {
      ack(error.message);
    }
  });
  socket.send = (data) => new Promise((o, x) => socket[send](data, (err, data) => err ? x(err) : o(data)));

  return socket;
};

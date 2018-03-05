const { emit, on, send } = require('./symbol');

module.exports = (opts = {}) => (socket) => {
  socket[emit] = socket.emit;
  socket[on] = socket.on;
  socket[send] = socket.send;

  socket.emit = (event, data, ack) => new Promise((o, x) => socket[emit](event, data, (err, data, ...rest) => ack ? ack(err, data, ...rest) : err ? x(err) : o(data)));

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

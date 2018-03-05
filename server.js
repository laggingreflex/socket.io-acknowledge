const { emit, on } = require('./symbol');
const client = require('./client');

module.exports = (opts = {}) => (socket, next) => {
  client(opts)(socket);
  return next();
};

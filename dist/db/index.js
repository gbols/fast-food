'use strict';

var _require = require('pg'),
    Pool = _require.Pool;

var pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'zainab1#',
  port: 5432
});

module.exports = {
  query: function query(text, params) {
    return pool.query(text, params);
  },
  connect: function connect() {
    return pool.connect();
  }
};
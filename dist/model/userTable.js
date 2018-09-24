'use strict';

var _pg = require('pg');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pool = new _pg.Pool(_config2.default.heroku);

var createUserTable = async function createUserTable() {
  var client = await pool.connect();
  try {
    var table = await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log(table);
    var createdTable = await client.query('CREATE TABLE users (\n      userid SERIAL PRIMARY KEY,\n      username varchar(255),\n      email varchar(255),\n      address varchar(255),\n      phone varchar(255),\n      password varchar(255)\n    )');
    console.log(createdTable);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

createUserTable();
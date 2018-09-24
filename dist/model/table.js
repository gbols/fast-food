'use strict';

var _pool = require('../config/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUserTable = async function createUserTable() {
  var client = await _pool2.default.connect();
  try {
    var table = await client.query('DROP TABLE IF EXISTS users CASCADE');

    var resultDrop = table.error ? table : 'users table dropped successfully';
    console.log(resultDrop);

    var createdTable = await client.query('CREATE TABLE users (\n      userid SERIAL PRIMARY KEY,\n      username varchar(255),\n      email varchar(255),\n      address varchar(255),\n      phone varchar(255),\n      password varchar(255)\n    )');

    var resultCreate = createdTable.error ? createdTable : 'users table created successfully';
    console.log(resultCreate);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

var createOrderTable = async function createOrderTable() {
  var client = await _pool2.default.connect();
  try {
    var table = await client.query('DROP TABLE IF EXISTS orders CASCADE');

    var resultDrop = table.error ? table : 'orders table dropped successfully';
    console.log(resultDrop);

    var createdTable = await client.query('CREATE TABLE orders (\n      orderid SERIAL PRIMARY KEY,\n      userid bigint,\n      quantity bigint,\n      description varchar(255),\n      price bigint,\n      orderat varchar(255),\n      status varchar(255)\n    )');

    var resultCreate = createdTable.error ? createdTable : 'orders table created successfully';
    console.log(resultCreate);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

createUserTable();
createOrderTable();
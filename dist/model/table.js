'use strict';

var _pool = require('../config/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUserTable = async function createUserTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    await client.query('CREATE TABLE users (\n      userid SERIAL PRIMARY KEY,\n      username varchar(255),\n      email varchar(255),\n      address varchar(255),\n      phone varchar(255),\n      password varchar(255),\n      role varchar(255)\n    )');
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

var createOrderTable = async function createOrderTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS orders CASCADE');

    await client.query('CREATE TABLE orders (\n      orderid SERIAL PRIMARY KEY,\n      status varchar(255),\n      orderat varchar(255),\n      userid bigint,\n      info json\n    )');

    await client.query('INSERT INTO orders (info, status, orderat, userid) VALUES ($1, $2, $3, $4) RETURNING *', ['{ "customer": "John Doe", "items": {"product": "Beer","qty": 6}}', 'new', Date.now(), 1]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

var createMenuTable = async function createMenuTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS menus CASCADE');

    await client.query('CREATE TABLE menus (\n      menuid SERIAL PRIMARY KEY,\n      description varchar(255),\n      price bigint,\n      imageurl varchar(255),\n      menutitle varchar(255),\n      userid bigint\n    )');

    await client.query('INSERT INTO menus (description,price,imageurl,menutitle,userid) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['Iyan is made from pounding yam repeatedly with a club like cooking', 850, 'https://res.cloudinary.com/daj3mflah/image/upload/v1538707203/emapkvg6whfgi0ge759w.jpg', 'Beans and Yam', 1]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

createUserTable();
createOrderTable();
createMenuTable();
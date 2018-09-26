'use strict';

var _pool = require('../config/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUserTable = async function createUserTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    await client.query('CREATE TABLE users (\n      userid SERIAL PRIMARY KEY,\n      username varchar(255),\n      email varchar(255),\n      address varchar(255),\n      phone varchar(255),\n      password varchar(255)\n    )');
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

var createOrderTable = async function createOrderTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS orders CASCADE');

    await client.query('CREATE TABLE orders (\n      orderid SERIAL PRIMARY KEY,\n      userid bigint,\n      quantity bigint,\n      description varchar(255),\n      price bigint,\n      orderat varchar(255),\n      status varchar(255)\n    )');

    await client.query('INSERT INTO orders (userid,quantity,description,price,orderat,status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [1, 5, 'Beans and Yam', 800, Date.now(), 'New']);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

var createMenuTable = async function createMenuTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS menus CASCADE');

    await client.query('CREATE TABLE menus (\n      menuid SERIAL PRIMARY KEY,\n      description varchar(255),\n      price bigint,\n      imageurl varchar(255),\n      menutitle varchar(255),\n      adminid bigint\n    )');

    await client.query('INSERT INTO menus (description,price,imageurl,menutitle,adminid) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['Iyan is made from pounding yam repeatedly with a club like cooking', 850, 'https://stackoverflow.com/questions/33023469/node-postgres-and-getting-joined-fields-with-repeated-names', 'Beans and Yam', 1]);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

var createAdminTable = async function createAdminTable() {
  var client = await _pool2.default.connect();
  try {
    await client.query('DROP TABLE IF EXISTS admins CASCADE');

    await client.query('CREATE TABLE admins (\n      adminid SERIAL PRIMARY KEY,\n      username varchar(255),\n      email varchar(255),\n      password varchar(255)\n    )');
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

createUserTable();
createOrderTable();
createMenuTable();
createAdminTable();
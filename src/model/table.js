import pool from '../config/pool';


const createUserTable = async () => {
  const client = await pool.connect();
  try {
    const table = await client.query('DROP TABLE IF EXISTS users CASCADE');

    const resultDrop = table.error ? table : 'users table dropped successfully';
    console.log(resultDrop);

    const createdTable = await client.query(`CREATE TABLE users (
      userid SERIAL PRIMARY KEY,
      username varchar(255),
      email varchar(255),
      address varchar(255),
      phone varchar(255),
      password varchar(255)
    )`);

    const resultCreate = createdTable.error ? createdTable : 'users table created successfully';
    console.log(resultCreate);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

const createOrderTable = async () => {
  const client = await pool.connect();
  try {
    const table = await client.query('DROP TABLE IF EXISTS orders CASCADE');

    const resultDrop = table.error ? table : 'orders table dropped successfully';
    console.log(resultDrop);

    const createdTable = await client.query(`CREATE TABLE orders (
      orderid SERIAL PRIMARY KEY,
      userid bigint,
      quantity bigint,
      description varchar(255),
      price bigint,
      orderat varchar(255),
      status varchar(255)
    )`);

    const resultCreate = createdTable.error ? createdTable : 'orders table created successfully';
    console.log(resultCreate);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

createUserTable();
createOrderTable();

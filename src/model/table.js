import pool from '../config/pool';


const createUserTable = async () => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS users CASCADE');

    await client.query(`CREATE TABLE users (
      userid SERIAL PRIMARY KEY,
      username varchar(255),
      email varchar(255),
      address varchar(255),
      phone varchar(255),
      password varchar(255),
      role varchar(255)
    )`);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

const createOrderTable = async () => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS orders CASCADE');

    await client.query(`CREATE TABLE orders (
      orderid SERIAL PRIMARY KEY,
      status varchar(255),
      orderat varchar(255),
      userid bigint,
      info json
    )`);

    await client.query('INSERT INTO orders (info, status, orderat, userid) VALUES ($1, $2, $3, $4) RETURNING *', ['{ "customer": "John Doe", "items": {"product": "Beer","qty": 6}}', 'new', Date.now(), 1]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

const createMenuTable = async () => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS menus CASCADE');

    await client.query(`CREATE TABLE menus (
      menuid SERIAL PRIMARY KEY,
      description varchar(255),
      price bigint,
      imageurl varchar(255),
      menutitle varchar(255),
      userid bigint
    )`);

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

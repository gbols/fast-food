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
      password varchar(255)
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
      userid bigint,
      quantity bigint,
      description varchar(255),
      price bigint,
      orderat varchar(255),
      status varchar(255)
    )`);

    await client.query('INSERT INTO orders (userid,quantity,description,price,orderat,status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [1, 5, 'Beans and Yam', 800, Date.now(), 'New']);
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
      adminid bigint
    )`);

    await client.query('INSERT INTO menus (description,price,imageurl,menutitle,adminid) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['Iyan is made from pounding yam repeatedly with a club like cooking', 850, 'https://stackoverflow.com/questions/33023469/node-postgres-and-getting-joined-fields-with-repeated-names', 'Beans and Yam', 1]);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

const createAdminTable = async () => {
  const client = await pool.connect();
  try {
    await client.query('DROP TABLE IF EXISTS admins CASCADE');

    await client.query(`CREATE TABLE admins (
      adminid SERIAL PRIMARY KEY,
      username varchar(255),
      email varchar(255),
      password varchar(255)
    )`);
  } catch (error) {
    throw error;
  } finally {
    client.end();
  }
};

createUserTable();
createOrderTable();
createMenuTable();
createAdminTable();

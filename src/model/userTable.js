import { Pool } from 'pg';
import dbconfig from '../config';

const pool = new Pool(dbconfig.heroku);

const createUserTable = async () => {
  const client = await pool.connect();
  try {
    const table = await client.query('DROP TABLE IF EXISTS users CASCADE');
    console.log(table);
    const createdTable = await client.query(`CREATE TABLE users (
      userid SERIAL PRIMARY KEY,
      username varchar(255),
      email varchar(255),
      address varchar(255),
      phone varchar(255),
      password varchar(255)
    )`);
    console.log(createdTable);
  } catch (error) {
    console.log(error);
  } finally {
    client.end();
  }
};

createUserTable();

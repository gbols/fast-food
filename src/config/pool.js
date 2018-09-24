import { Pool } from 'pg';
import dotenv from 'dotenv';
import dbConfig from './config';


let pool;
dotenv.config();
if (process.env.NODE_ENV === 'test') {
  pool = new Pool(dbConfig.heroku);
  console.log(dbConfig.heroku);
} else {
  process.env.NODE_ENV = 'development';
  pool = new Pool(dbConfig.development);
  console.log(dbConfig.development);
}
console.log(process.env.NODE_ENV);

const poolConnect = pool;
export default poolConnect;
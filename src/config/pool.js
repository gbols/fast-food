import { Pool } from 'pg';
import dotenv from 'dotenv';
import dbConfig from './config';


let pool;
dotenv.config();
if (process.env.NODE_ENV === 'test') {
  pool = new Pool(dbConfig.heroku);
} else {
  process.env.NODE_ENV = 'production';
  pool = new Pool(dbConfig.production);
}

const poolConnect = pool;
export default poolConnect;

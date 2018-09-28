import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Joi from 'joi';
import pool from '../config/pool';

dotenv.config();
/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const signUp = async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(30)
      .required(),
    email: Joi.string().email({ minDomainAtoms: 1 }).required(),
    address: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
    if (rows[0]) {
      return res.status(409).send({ success: false, message: 'user with credentials already exits' });
    }

    const hash = bcrypt.hashSync(req.body.password, 1);
    const result = await client.query('INSERT INTO users  (username,email,address,password,phone) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.body.username, req.body.email, req.body.address, hash, req.body.phone]);
    const user = {
      username: result.rows[0].username,
      email: result.rows[0].email,
      address: result.rows[0].address,
      phone: result.rows[0].phone,
    };
    const token = Jwt.sign({ user }, process.env.JWT_SECRET);
    res.status(200).send({
      success: true, message: 'user account successfully created!....', token,
    });
  } catch (err) {
    throw err.stack;
  } finally {
    client.release();
  }
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const login = async (req, res) => {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [req.body.username]);
    if (!rows[0]) {
      return res.status(404).send({ success: false, message: 'Invalid username or password' });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, rows[0].password);
    if (!correctPassword) {
      return res.status(401).send({ success: false, message: 'Invalid username or password' });
    }
    const user = {
      username: rows[0].username,
      email: rows[0].email,
      address: rows[0].address,
      phone: rows[0].phone,
    };
    const token = Jwt.sign({ user }, process.env.JWT_SECRET);
    res.status(200).send({
      success: true, message: 'user successfully logged In!....', token,
    });
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};
/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @returns {}
 */
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;
  if (!bearerHeader) return res.status(403).send({ success: false, message: 'Forbidden!,valid token needed to access route' });
  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  req.token = bearerToken;
  next();
};


/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const signOut = (req, res) => {
  res.status(200).send({ success: true, message: 'you have successfully signed out' });
};


/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const getAllMenu = async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM menus');
    if (rows.length === 0) {
      return res.status(200).send({ success: false, message: 'there are no menu items yet' });
    }
    res.status(200).send({ success: true, message: 'menu items successfully returned!...', menus: rows });
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const catchAllRoutes = (req, res) => {
  res.status(404).send({ success: false, message: 'the requested route can\'t be found' });
};

/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const errorHanlder = (err, req, res, next) => {
  res.status(500).send({ success: false, message: 'Something broke when processing request!' });
  throw err.stack;
};
export {
  signUp, login, getAllMenu, catchAllRoutes, errorHanlder,
  verifyToken, signOut,
};

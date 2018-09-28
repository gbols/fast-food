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
const adminSignUp = async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(30)
      .required(),
    email: Joi.string().email({ minDomainAtoms: 1 }).required(),
    password: Joi.string().required(),
  });
  const { error } = Joi.validate(req.body, schema);
  if (error) {
    return res.status(400).send({ success: false, message: error.message });
  }
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM admins WHERE username = $1', [req.body.username]);
    if (rows[0]) {
      return res.status(409).send({ success: false, message: 'admin with credentials already exits' });
    }

    const hash = bcrypt.hashSync(req.body.password, 1);
    const result = await client.query('INSERT INTO admins  (username,email,password) VALUES ($1, $2, $3) RETURNING *', [req.body.username, req.body.email, hash]);
    const admin = {
      username: result.rows[0].username,
      email: result.rows[0].email,
    };
    const token = Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN);
    res.status(200).send({
      success: true, message: 'admin account successfully created!....', details: result.rows[0], token,
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
const adminLogin = async (req, res) => {
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
    const { rows } = await client.query('SELECT * FROM admins WHERE username = $1', [req.body.username]);
    if (!rows[0]) {
      return res.status(404).send({ success: false, message: 'admin with credentails doesnt exits in the database!....' });
    }
    const correctPassword = bcrypt.compareSync(req.body.password, rows[0].password);
    if (!correctPassword) {
      return res.status(401).send({ success: false, message: 'the password dooesnt match the supplied username!...' });
    }

    const admin = {
      username: rows[0].username,
      email: rows[0].email,
    };

    const token = Jwt.sign({ admin }, process.env.JWT_SECRET_ADMIN);
    res.status(200).send({
      success: true, message: 'admin successfully logged In!....', details: rows[0], token,
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
const postMenu = async (req, res) => {
  const schema = {
    menutitle: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    imageurl: Joi.string().required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send({ success: false, message: error.message });
  let decoded;
  try {
    decoded = Jwt.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    res.status(403).send({ success: false, message: 'You do not have access to view this route' });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('INSERT INTO menus (adminid,description,price,menutitle,imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *', [decoded.admin.adminid, req.body.description, req.body.price, req.body.menutitle, req.body.imageurl]);
    res.status(200).send({ success: true, message: 'menu was succesfully created', menu: rows[0] });
  } catch (poolErr) {
    throw poolErr;
  } finally {
    client.release();
  }
};


/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const getAnOrder = async (req, res) => {
  const orderId = Number(req.params.id);
  const result = Number.isInteger(orderId);
  if (!result) {
    return res.status(400).send({ success: false, message: 'The order ID must be an integer!...' });
  }
  try {
    Jwt.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: 'You do not have access to view this route' });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM orders WHERE orderid = $1', [orderId]);
    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: 'the given order does\'t exits' });
    }
    res.status(200).send({ success: true, message: 'orders successfully returned!...', order: rows[0] });
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
const getAllOrders = async (req, res) => {
  try {
    Jwt.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: 'You do not have access to view this route' });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM orders');
    if (rows.length === 0) {
      return res.status(200).send({ success: false, message: 'there are no orders yet' });
    }
    res.status(200).send({ success: true, message: 'orders successfully returned!...', orders: rows });
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
const updateOrderStatus = async (req, res) => {
  const orderId = Number(req.params.id);
  const result = Number.isInteger(orderId);
  if (!result) {
    return res.status(400).send({ success: false, message: 'The order ID must be an integer!...' });
  }
  const schema = {
    status: Joi.any().valid(['new', 'processing', 'completed', 'cancelled']).required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send({ success: false, message: 'You do not have access to view this route' });
  try {
    Jwt.verify(req.token, process.env.JWT_SECRET_ADMIN);
  } catch (err) {
    return res.status(401).send({ success: false, message: 'You do not have access to view this route' });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('UPDATE orders SET status = $1 WHERE orderid = $2 RETURNING *', [req.body.status, orderId]);
    if (!rows[0]) {
      return res.status(404).send({ success: false, message: 'The given order doesn\'t exist in the database' });
    }
    res.status(200).send({ success: true, message: 'order status was successfully updated', order: rows[0] });
  } catch (poolErr) {
    throw poolErr;
  } finally {
    client.release();
  }
};


/**
 * @param  {} req
 * @param  {} res
 * @returns {}
 */
const welcomeMessage = (req, res) => {
  res.status(200).send({ success: true, message: 'welcome to fast food fast a platform to order and enjoy intercontinental delicacies' });
};
export {
  postMenu, adminSignUp, adminLogin, getAnOrder, getAllOrders, updateOrderStatus, welcomeMessage,
};

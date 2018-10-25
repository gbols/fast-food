import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Joi from 'joi';
import pool from '../config/pool';

dotenv.config();

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
    const { rows } = await client.query('INSERT INTO menus (userid,description,price,menutitle,imageurl) VALUES ($1, $2, $3, $4, $5) RETURNING *', [decoded.user.userid, req.body.description, req.body.price, req.body.menutitle, req.body.imageurl]);
    res.status(200).send({ success: true, message: 'menu was succesfully created', menu: rows[0] });
  } catch (poolErr) {
    throw poolErr;
  } finally {
    client.release();
  }
};


/**
 * @param {*} req
 * @param {*} res
 * @returns
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
  postMenu, getAnOrder, getAllOrders, updateOrderStatus, welcomeMessage,
};

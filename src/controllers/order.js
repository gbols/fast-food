import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Joi from 'joi';
import pool from '../config/pool';


dotenv.config();
const checkValidOrder = async (orders) => {
  const client = await pool.connect();
  for (const order of orders) {
    const { rows } = await client.query('SELECT * FROM menus WHERE menuid = $1', [order.menuid]);
    if (!rows[0]) return order;
  }
  return 'valid';
};

const postOrder = async (req, res) => {
  const orderSchema = {
    menuid: Joi.number().required(),
    quantity: Joi.number().required(),
  };
  const ordersSchema = {
    myOrders: Joi.array().min(1).items(Joi.object(orderSchema)).required(),
  };
  const { error, value: { myOrders } } = Joi.validate(req.body, ordersSchema);
  if (error) return res.status(400).send({ success: false, message: error.message });
  let decoded;
  try {
    decoded = Jwt.verify(req.token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(400).send({ success: false, message: err.message });
  }
  const result = await checkValidOrder(myOrders);
  if (result !== 'valid') return res.status(400).send({ success: false, message: `the menuid of the given ${JSON.stringify(result)} order does not exit` });
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('INSERT INTO orders (userid,orderat,status,info) VALUES ($1, $2, $3, $4) RETURNING *', [decoded.user.userid, Date.now(), 'new', JSON.stringify(myOrders)]);
    res.status(200).send({ success: true, message: 'order was succesfully created', data: rows[0] });
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
const getOrderHistory = async (req, res) => {
  const userId = Number(req.params.id);
  const result = Number.isInteger(userId);
  if (!result) {
    return res.status(400).send({ success: false, message: 'orderId must be an integer' });
  }
  let decoded;
  try {
    decoded = Jwt.verify(req.token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
  if (userId !== decoded.user.userid) {
    return res.status(409).send({ success: false, message: 'valid credentials needed to access route!.' });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('SELECT * FROM orders WHERE userid = $1', [userId]);
    if (rows.length === 0) {
      return res.status(404).send({ success: false, message: 'you havent place any order on the platform' });
    }
    res.status(200).send({ success: true, message: 'orders was successfully returned! ....', orders: rows });
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export { postOrder, getOrderHistory };

import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import Joi from 'joi';
import pool from '../config/pool';


dotenv.config();


const postOrder = async (req, res) => {
  const schema = {
    quantity: Joi.number().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
  };
  const { error } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send({ success: false, message: error.message });
  let decoded;
  try {
    decoded = Jwt.verify(req.token, process.env.JWT_SECRET);
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
  let client;
  try {
    client = await pool.connect();
    const { rows } = await client.query('INSERT INTO orders (userid,quantity,description,price,orderat,status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [decoded.user.userid, req.body.quantity, req.body.description, req.body.price, Date.now(), 'new']);
    res.status(200).send({ success: true, message: 'order was succesfully created', order: rows[0] });
  } catch (poolErr) {
    console.log(poolErr);
  } finally {
    client.release();
  }
};

const getAnOrder = async (req, res) => {
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
    console.log(error);
  } finally {
    client.release();
  }
};

export { postOrder, getAnOrder };

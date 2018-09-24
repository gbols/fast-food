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
  try {
    const client = await pool.connect();
    const { rows } = await client.query('INSERT INTO orders (userid,quantity,description,price,orderat,status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [decoded.user.userid, req.body.quantity, req.body.description, req.body.price, Date.now(), 'new']);
    res.status(200).send({ success: true, message: 'order was succesfully created', order: rows[0] });
  } catch (poolErr) {
    console.log(poolErr);
  }
};

export default postOrder;
